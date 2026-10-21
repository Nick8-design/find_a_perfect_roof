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

const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

// Connects via stateless HTTPS requests (no WebSocket drops or idle timeouts)
const sql = neon(process.env.DATABASE_URL);

// Wrapper that returns { rows } to keep your models 100% compatible
async function query(text, params = []) {
  const rows = await sql.query(text, params);
  return { rows };
}

async function initDB() {
  try {
    // 1. Auto-create Houses table
    await query(`
      CREATE TABLE IF NOT EXISTS houses (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        location VARCHAR(100) NOT NULL,
        bedrooms INT NOT NULL,
        monthly_rent NUMERIC(10, 2) NOT NULL,
        deposit_amount NUMERIC(10, 2) NOT NULL,
        description TEXT,
        images TEXT[] DEFAULT '{}',
        amenities TEXT[] DEFAULT '{}',
        contact_name VARCHAR(100) NOT NULL,
        contact_phone VARCHAR(50) NOT NULL,
        contact_email VARCHAR(100),
        contact_role VARCHAR(50) DEFAULT 'Caretaker',
        status VARCHAR(20) DEFAULT 'AVAILABLE',
        locked_until TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        locked_by VARCHAR(50) DEFAULT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Auto-create Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        phone VARCHAR(50),
        password_hash VARCHAR(255) NOT NULL,
        avatar TEXT,
        role VARCHAR(20) DEFAULT 'USER',
        reset_otp VARCHAR(20) DEFAULT NULL,
        reset_otp_expiry TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Auto-create Bookings table
    await query(`
      CREATE TABLE IF NOT EXISTS bookings (
        booking_id VARCHAR(50) PRIMARY KEY,
        house_id VARCHAR(50) REFERENCES houses(id),
        user_id VARCHAR(50) NOT NULL,
        tenant_name VARCHAR(100) NOT NULL,
        tenant_phone VARCHAR(50) NOT NULL,
        tenant_email VARCHAR(100),
        months_paid INT NOT NULL DEFAULT 1,
        monthly_rent NUMERIC(10, 2) NOT NULL,
        total_rent_amount NUMERIC(10, 2) NOT NULL,
        deposit_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
        total_amount_paid NUMERIC(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'PENDING',
        payment_method VARCHAR(30) DEFAULT 'PAYPAL',
        paypal_order_id VARCHAR(100) DEFAULT NULL,
        paypal_capture_id VARCHAR(100) DEFAULT NULL,
        paypal_payer_id VARCHAR(100) DEFAULT NULL,
        paypal_payer_email VARCHAR(100) DEFAULT NULL,
        tenant_notes TEXT,
        warning_sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        paid_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
      );
    `);

    // Add warning_sent column if not existing
    try {
      await query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS warning_sent BOOLEAN DEFAULT FALSE;`);
    } catch {
      // Column might already exist
    }

    console.log('PostgreSQL database tables verified and ready.');
  } catch (err) {
    console.error('Database auto-initialization error:', err);
  }
}

initDB();

module.exports = { query };


