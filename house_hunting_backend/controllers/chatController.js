const { GoogleGenAI } = require('@google/genai');
const House = require('../models/House');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define tools/functions Gemini can call
const tools = [
  {
    functionDeclarations: [
      {
        name: 'searchHouses',
        description: 'Search available rental houses by location, maximum rent budget, or bedrooms.',
        parameters: {
          type: 'OBJECT',
          properties: {
            location: { type: 'STRING', description: 'City or neighborhood name (e.g. Westlands, Kilimani)' },
            maxRent: { type: 'NUMBER', description: 'Maximum monthly rent budget in USD' },
            bedrooms: { type: 'NUMBER', description: 'Number of bedrooms required' },
          },
        },
      },
      {
        name: 'getHouseDetails',
        description: 'Get full details and caretaker/landlord contact info for a specific house ID.',
        parameters: {
          type: 'OBJECT',
          properties: {
            houseId: { type: 'STRING', description: 'The unique ID of the house (e.g. house_1)' },
          },
          required: ['houseId'],
        },
      },
    ],
  },
];

exports.chat = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    // Send user message and tools to Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...conversationHistory,
        { role: 'user', parts: [{ text: message }] },
      ],
      config: {
        systemInstruction: `You are an expert AI Real Estate and House Hunting Assistant. 
        Help users find suitable rental houses, answer questions about amenities and caretakers, 
        and guide them to book houses by paying holding deposits with PayPal. Always be friendly and helpful.`,
        tools: tools,
      },
    });

    const candidate = response.candidates[0];
    const functionCall = candidate.content?.parts?.find((p) => p.functionCall)?.functionCall;

    // If Gemini decided to call a tool, execute it
    if (functionCall) {
      let functionResult;

      if (functionCall.name === 'searchHouses') {
        functionResult = await House.search(functionCall.args || {});
      } else if (functionCall.name === 'getHouseDetails') {
        functionResult = await House.getById(functionCall.args.houseId);
      }

      // Return both the tool data (for UI cards) and a final response from Gemini
      return res.json({
        reply: `I found listings matching your criteria. Take a look:`,
        action: functionCall.name,
        data: functionResult,
      });
    }

    // Normal conversational reply
    const textReply = candidate.content?.parts?.[0]?.text || "How can I help you find your next home?";
    res.json({ reply: textReply });
  } catch (error) {
    console.error('Chat controller error:', error);
    res.status(500).json({ error: 'AI Assistant failed to process request.' });
  }
};