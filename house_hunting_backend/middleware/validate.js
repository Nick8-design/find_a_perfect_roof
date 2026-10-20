// Validates booking creation requests
const validateBookingInput = (req, res, next) => {
  const { houseId, userId, tenantName, tenantPhone, startDate } = req.body;

  if (!houseId || !userId || !tenantName || !tenantPhone || !startDate) {
    return res.status(400).json({
      error: 'Missing required fields: houseId, userId, tenantName, tenantPhone, and startDate are mandatory.',
    });
  }
  next();
};

// Validates chat messages
const validateChatMessage = (req, res, next) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({
      error: 'A non-empty "message" string is required.',
    });
  }
  next();
};

module.exports = { validateBookingInput, validateChatMessage };