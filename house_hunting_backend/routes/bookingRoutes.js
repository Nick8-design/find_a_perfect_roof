// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { optionalAuth } = require('../middleware/auth');

// POST /api/bookings/create-order (locks house & creates PayPal sandbox order)
router.post('/create-order', optionalAuth, bookingController.createOrder);

// POST /api/bookings/capture-order (captures PayPal payment & marks house as booked)
router.post('/capture-order', optionalAuth, bookingController.captureOrder);

// POST /api/bookings/cancel-order (releases lock if user closes PayPal popup)
router.post('/cancel-order', optionalAuth, bookingController.cancelOrder);

// GET /api/bookings/my-bookings (fetches all booked houses for current user)
router.get('/my-bookings', optionalAuth, bookingController.getMyBookings);

// POST /api/bookings/check-expirations (checks lease expirations & sends warnings)
router.post('/check-expirations', bookingController.triggerLeaseCron);

module.exports = router;
