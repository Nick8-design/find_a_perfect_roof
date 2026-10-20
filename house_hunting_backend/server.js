const express = require('express');
const cors = require('cors');
require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

// 1. Auto-initialize Neon PostgreSQL tables & initial seed listings
require('./database/db');

// 2. Import Routers
const houseRoutes = require('./routes/houseRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const chatRoutes = require('./routes/chatRoutes');

// 3. Import Middleware
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// 4. Global Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Optional: Lightweight terminal logger for debugging incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// 5. Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI House Hunting & PayPal Booking API',
    timestamp: new Date().toISOString(),
  });
});

// 6. Mount API Routes
app.use('/api/houses', houseRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chat', chatRoutes);

// 7. Error Handling Middleware (must be registered last)
app.use(notFoundHandler);
app.use(errorHandler);

// 8. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log(`Environment:       ${process.env.NODE_ENV || 'development'}`);
  console.log(`===============================================`);
});