// Force all DNS lookups to use IPv4 first (prevents IPv6 timeouts on cloud databases and APIs)
const dns = require('dns');
const originalLookup = dns.lookup;
dns.lookup = function (hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = typeof options === 'number' ? { family: options } : { ...options };
  if (!options.family) {
    options.family = 4;
  }
  return originalLookup(hostname, options, callback);
};
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Auto-initialize Neon PostgreSQL tables & initial seed listings
require('./database/db');

// 2. Import Routers
const houseRoutes = require('./routes/houseRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');

// 3. Import Lease Expiration & Warning Cron Service
const { startLeaseCron } = require('./services/leaseCronService');

// 4. Import Middleware
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// 5. Global Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Lightweight terminal logger for debugging incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// 6. Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI House Hunting & PayPal Booking API',
    timestamp: new Date().toISOString(),
  });
});

// 7. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/houses', houseRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chat', chatRoutes);

// 8. Error Handling Middleware (must be registered last)
app.use(notFoundHandler);
app.use(errorHandler);

// 9. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log(`Environment:       ${process.env.NODE_ENV || 'development'}`);
  console.log(`===============================================`);

  // Start automated background lease expiration checker & warning service
  startLeaseCron();
});
