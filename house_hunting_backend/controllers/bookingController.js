const House = require('../models/House');
const Booking = require('../models/Booking');

// Helper: Get PayPal Sandbox Access Token
async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch(`${process.env.PAYPAL_API_BASE_URL}/v1/oauth2/token`, {
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

// 1. Create PayPal Order & Lock House for 15 minutes
exports.createOrder = async (req, res) => {
  try {
    const {
      houseId,
      userId,
      tenantName,
      tenantPhone,
      tenantEmail,
      monthsPaid = 1,
      startDate,
      tenantNotes,
    } = req.body;

    // A. Check availability & place atomic 15-minute lock
    const lockedHouse = await House.lockHouse(houseId, userId, 15);
    if (!lockedHouse) {
      return res.status(409).json({
        error: 'This house is currently on hold by another user or already booked.',
      });
    }

    // B. Calculate financial breakdown & save initial pending booking
    const bookingId = `BOOK-${Date.now()}`;
    const booking = await Booking.create({
      bookingId,
      houseId,
      userId,
      tenantName,
      tenantPhone,
      tenantEmail,
      monthsPaid,
      monthlyRent: lockedHouse.monthly_rent,
      depositAmount: lockedHouse.deposit_amount,
      startDate,
      tenantNotes,
    });

    // C. Create Order on PayPal Sandbox
    const accessToken = await getPayPalAccessToken();
    const paypalResponse = await fetch(`${process.env.PAYPAL_API_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': bookingId, // Prevents duplicate transactions
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: bookingId,
            description: `Rent for ${lockedHouse.title} (${monthsPaid} months + deposit)`,
            custom_id: JSON.stringify({ bookingId, houseId, userId }),
            amount: {
              currency_code: 'USD',
              value: Number(booking.total_amount_paid).toFixed(2),
            },
          },
        ],
      }),
    });

    const orderData = await paypalResponse.json();

    // D. Attach PayPal Order ID to the booking record
    await Booking.attachPayPalOrder(bookingId, orderData.id);
const approveLink = orderData.links?.find((link) => link.rel === 'approve');
    res.json({
      success: true,
      orderId: orderData.id,
      bookingId,
      totalAmount: booking.total_amount_paid,
      endDate: booking.end_date,
      approveUrl: approveLink ? approveLink.href : null,
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ error: 'Failed to initiate booking payment.' });
  }
};

// 2. Capture PayPal Payment (called after tenant approves in PayPal popup)
exports.captureOrder = async (req, res) => {
  try {
    const { orderId, bookingId, houseId } = req.body;
    if (!orderId || !bookingId) {
      return res.status(400).json({ error: 'orderId and bookingId are required.' });
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${process.env.PAYPAL_API_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const responseText = await response.text();
    let captureData = {};
    if (responseText) {
      try {
        captureData = JSON.parse(responseText);
      } catch (e) {
        console.error('Non-JSON PayPal response:', responseText);
      }
    }

    if (response.ok && captureData.status === 'COMPLETED') {
      const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0] || {};
      const payer = captureData.payer || {};

      const finalizedBooking = await Booking.markPaid(bookingId, {
        captureId: capture.id || orderId,
        payerId: payer.payer_id || 'UNKNOWN',
        payerEmail: payer.email_address || 'UNKNOWN',
      });

      if (houseId) await House.markBooked(houseId);

      return res.json({
        success: true,
        message: 'Payment successfully captured! House booked.',
        booking: finalizedBooking,
      });
    } else {
      // Clear error message explaining why capture failed
      return res.status(response.status || 400).json({
        error:
          captureData.message ||
          captureData.details?.[0]?.description ||
          'Payment cannot be captured yet. The buyer must first approve the order in the PayPal popup.',
        paypalDetails: captureData,
      });
    }
  } catch (error) {
    console.error('Error capturing payment:', error);
    res.status(500).json({ error: 'Failed to capture payment.' });
  }
};

// 3. Release lock if user cancels the PayPal popup
exports.cancelOrder = async (req, res) => {
  try {
    const { houseId, bookingId } = req.body;
    if (houseId) await House.releaseLock(houseId);
    if (bookingId) await Booking.markFailed(bookingId, 'CANCELLED');
    res.json({ success: true, message: 'Reservation hold released.' });
  } catch (error) {
    console.error('Error releasing lock:', error);
    res.status(500).json({ error: 'Failed to release lock.' });
  }
};





