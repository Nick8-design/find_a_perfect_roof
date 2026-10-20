const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// POST /api/bookings/create-order (locks house & creates PayPal sandbox order)
router.post('/create-order', bookingController.createOrder);

// POST /api/bookings/capture-order (captures PayPal payment & marks house as booked)
router.post('/capture-order', bookingController.captureOrder);

// POST /api/bookings/cancel-order (releases lock if user closes PayPal popup)
router.post('/cancel-order', bookingController.cancelOrder);

module.exports = router;