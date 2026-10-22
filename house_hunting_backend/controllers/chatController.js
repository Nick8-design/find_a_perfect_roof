// controllers/chatController.js
const { GoogleGenAI } = require('@google/genai');
const House = require('../models/House');
const Booking = require('../models/Booking');

const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6Kzx3DisvKVHk2b-4rHgLhBivjYlswjnt7TB50r48iahg" });

function getPayPalBaseUrl() {
  const url = process.env.PAYPAL_API_BASE_URL || 'https://api-m.sandbox.paypal.com';
  return url.replace('https://sandbox.paypal.com', 'https://api-m.sandbox.paypal.com');
}

// Helper: Get PayPal Access Token
async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const baseUrl = getPayPalBaseUrl();
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const data = await response.json();
  return data.access_token;
}

// Tools/Functions Nixy can execute
const tools = [
  {
    functionDeclarations: [
      {
        name: 'searchHouses',
        description: 'Search available rental houses by location, maximum rent budget, or bedrooms.',
        parameters: {
          type: 'OBJECT',
          properties: {
            location: { type: 'STRING', description: 'City or neighborhood name (e.g. Westlands, Kilimani, Karen)' },
            maxRent: { type: 'NUMBER', description: 'Maximum monthly rent budget in USD' },
            bedrooms: { type: 'NUMBER', description: 'Number of bedrooms required' },
          },
        },
      },
      {
        name: 'getHouseDetails',
        description: 'Get full details, photo gallery, amenities, and caretaker/landlord contact info for a specific house ID.',
        parameters: {
          type: 'OBJECT',
          properties: {
            houseId: { type: 'STRING', description: 'The unique ID of the house (e.g. house_1)' },
          },
          required: ['houseId'],
        },
      },
      {
        name: 'initiateBooking',
        description: 'Book a house directly through chat. Locks the property for 15 minutes and creates a PayPal checkout order.',
        parameters: {
          type: 'OBJECT',
          properties: {
            houseId: { type: 'STRING', description: 'The ID of the house to book' },
            monthsPaid: { type: 'NUMBER', description: 'Number of months of rent to pay upfront (1-12)' },
            startDate: { type: 'STRING', description: 'Move-in date in YYYY-MM-DD format' },
            tenantName: { type: 'STRING', description: 'Full name of tenant' },
            tenantPhone: { type: 'STRING', description: 'Phone number of tenant' },
            tenantEmail: { type: 'STRING', description: 'Email address of tenant' },
          },
          required: ['houseId'],
        },
      },
    ],
  },
];

exports.chat = async (req, res) => {
  try {
    const {
      message,
      conversationHistory = [],
      userId = 'guest_chat_user',
      userName,
    } = req.body;

    // Determine greeting context based on logged-in user
    const userFirstName = userName ? userName.split(' ')[0] : null;
    const userGreetingContext = userFirstName
      ? `The user is logged in as ${userFirstName}. Greet or address them naturally by name when appropriate.`
      : userId && userId !== 'guest_chat_user'
      ? `The user is logged in.`
      : '';

    // Send user message and tools to Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...conversationHistory,
        { role: 'user', parts: [{ text: message }] },
      ],
      config: {
        systemInstruction: `You are Nixy, a real estate assistant for house rentals in Nairobi (Westlands, Kilimani, Karen, etc.).
        Be concise, helpful, and natural. Answer questions about properties, bedrooms, rent, deposits, amenities, and caretakers.
        When a user expresses intent to book a house (e.g., "I want to book house_1" or "reserve this house"), call initiateBooking to lock the property and generate their PayPal order.
        Never refer to yourself as Gemini AI or a language model—your name is Nixy. ${userGreetingContext}`,
        tools: tools,
      },
    });

    const candidate = response.candidates[0];
    const functionCall = candidate.content?.parts?.find((p) => p.functionCall)?.functionCall;

    if (functionCall) {
      let functionResult;
      const actionName = functionCall.name;

      if (actionName === 'searchHouses') {
        functionResult = await House.search(functionCall.args || {});
        return res.json({
          reply: `I found ${functionResult.length} available listing${functionResult.length === 1 ? '' : 's'} matching your search:`,
          action: actionName,
          data: functionResult,
        });
      } else if (actionName === 'getHouseDetails') {
        functionResult = await House.getById(functionCall.args.houseId);
        return res.json({
          reply: functionResult ? `Here are the details for ${functionResult.title}:` : `I could not locate that property.`,
          action: actionName,
          data: functionResult,
        });
      } else if (actionName === 'initiateBooking') {
        const { houseId, monthsPaid = 1, startDate, tenantName, tenantPhone, tenantEmail } = functionCall.args;

        // Place 15-minute lock on house
        const house = await House.lockHouse(houseId, userId, 15);
        if (!house) {
          return res.json({
            reply: `That property is currently on hold by another user or already booked. Would you like me to find similar alternatives?`,
            action: 'booking_unavailable',
          });
        }

        const moveIn = startDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];
        const bookingId = `BOOK-AI-${Date.now()}`;
        const newBooking = await Booking.create({
          bookingId,
          houseId,
          userId,
          tenantName: tenantName || userName || 'Tenant',
          tenantPhone: tenantPhone || '+254700000000',
          tenantEmail: tenantEmail || 'tenant@example.com',
          monthsPaid: Number(monthsPaid) || 1,
          monthlyRent: house.monthly_rent,
          depositAmount: house.deposit_amount,
          startDate: moveIn,
        });

        // Create PayPal Sandbox Order
        try {
          const accessToken = await getPayPalAccessToken();
          const baseUrl = getPayPalBaseUrl();
          const paypalRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'PayPal-Request-Id': bookingId,
            },
            body: JSON.stringify({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  reference_id: bookingId,
                  description: `Booking for ${house.title}`,
                  custom_id: JSON.stringify({ bookingId, houseId, userId }),
                  amount: {
                    currency_code: 'USD',
                    value: Number(newBooking.total_amount_paid).toFixed(2),
                  },
                },
              ],
            }),
          });

          const orderData = await paypalRes.json();
          await Booking.attachPayPalOrder(bookingId, orderData.id);

          const approveLink = orderData.links?.find((l) => l.rel === 'approve');

          return res.json({
            reply: `I've placed a 15-minute hold on **${house.title}** and created your PayPal order for **$${Number(newBooking.total_amount_paid).toFixed(2)}** (${newBooking.months_paid} month rent + deposit). Click below to complete your payment on PayPal:`,
            action: 'initiateBooking',
            data: {
              bookingId,
              orderId: orderData.id,
              approveUrl: approveLink ? approveLink.href : null,
              totalAmount: newBooking.total_amount_paid,
              monthlyRent: house.monthly_rent,
              depositAmount: house.deposit_amount,
              monthsPaid: newBooking.months_paid,
              startDate: newBooking.start_date,
              endDate: newBooking.end_date,
              house,
            },
          });
        } catch (paypalErr) {
          console.error('AI Booking PayPal error:', paypalErr);
          await House.releaseLock(houseId);
          return res.json({
            reply: `I was unable to initiate PayPal payment right now. Please try booking directly using the "Book" button on the listing card.`,
          });
        }
      }
    }

    const textReply = candidate.content?.parts?.[0]?.text || 'How can I help you find your next home?';
    res.json({ reply: textReply });
  } catch (error) {
    console.error('Chat controller error:', error);
    res.status(500).json({ error: 'Nixy failed to process your request.' });
  }
};
