const dns = require('dns');
const path = require('path');
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

// Load environment from backend root .env explicitly
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { neon } = require('@neondatabase/serverless');

// Connects via stateless HTTPS requests (no WebSocket drops or idle timeouts)
const sql = neon(process.env.DATABASE_URL);

// Wrapper that returns { rows } to keep your models 100% compatible
async function query(text, params = []) {
  const rows = await sql.query(text, params);
  return { rows };
}

async function initDB() {
  try {
    // 1. Auto-create Houses table with latitude and longitude
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
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        locked_until TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        locked_by VARCHAR(50) DEFAULT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure latitude and longitude columns exist on existing databases
    try {
      await query(`ALTER TABLE houses ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;`);
      await query(`ALTER TABLE houses ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;`);
    } catch {
      // Ignore if already present
    }

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

    try {
      await query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS warning_sent BOOLEAN DEFAULT FALSE;`);
    } catch {
      // Column might already exist
    }

    // 4. Update all existing houses without latitude/longitude with accurate Nairobi coordinates
    try {
      await query(`
        UPDATE houses
        SET 
          latitude = CASE 
            WHEN location ILIKE '%westlands%' THEN -1.2683 + (RANDOM() * 0.01 - 0.005)
            WHEN location ILIKE '%kilimani%' THEN -1.2921 + (RANDOM() * 0.01 - 0.005)
            WHEN location ILIKE '%kileleshwa%' THEN -1.2796 + (RANDOM() * 0.01 - 0.005)
            WHEN location ILIKE '%karen%' THEN -1.3197 + (RANDOM() * 0.015 - 0.0075)
            WHEN location ILIKE '%lavington%' THEN -1.2833 + (RANDOM() * 0.01 - 0.005)
            WHEN location ILIKE '%parklands%' THEN -1.2612 + (RANDOM() * 0.01 - 0.005)
            WHEN location ILIKE '%runda%' THEN -1.2155 + (RANDOM() * 0.01 - 0.005)
            WHEN location ILIKE '%muthaiga%' THEN -1.2520 + (RANDOM() * 0.01 - 0.005)
            WHEN location ILIKE '%upper hill%' OR location ILIKE '%upperhill%' THEN -1.2995 + (RANDOM() * 0.008 - 0.004)
            WHEN location ILIKE '%langata%' OR location ILIKE '%lang''ata%' THEN -1.3532 + (RANDOM() * 0.01 - 0.005)
            WHEN location ILIKE '%south b%' THEN -1.3100 + (RANDOM() * 0.008 - 0.004)
            WHEN location ILIKE '%south c%' THEN -1.3180 + (RANDOM() * 0.008 - 0.004)
            WHEN location ILIKE '%ngong%' THEN -1.3000 + (RANDOM() * 0.01 - 0.005)
            ELSE -1.286389 + (RANDOM() * 0.02 - 0.01)
          END,
          longitude = CASE
            WHEN location ILIKE '%westlands%' THEN 36.8044 + (RANDOM() * 0.01 - 0.005)
            WHEN location ILIKE '%kilimani%' THEN 36.7865 + (RANDOM() * 0.01 - 0.005)
            WHEN location ILIKE '%kileleshwa%' THEN 36.7885 + (RANDOM() * 0.01 - 0.005)
            WHEN location ILIKE '%karen%' THEN 36.7065 + (RANDOM() * 0.015 - 0.0075)
            WHEN location ILIKE '%lavington%' THEN 36.7667 + (RANDOM() * 0.01 - 0.005)
            WHEN location ILIKE '%parklands%' THEN 36.8206 + (RANDOM() * 0.01 - 0.005)
            WHEN location ILIKE '%runda%' THEN 36.8202 + (RANDOM() * 0.01 - 0.005)
            WHEN location ILIKE '%muthaiga%' THEN 36.8340 + (RANDOM() * 0.01 - 0.005)
            WHEN location ILIKE '%upper hill%' OR location ILIKE '%upperhill%' THEN 36.8163 + (RANDOM() * 0.008 - 0.004)
            WHEN location ILIKE '%langata%' OR location ILIKE '%lang''ata%' THEN 36.7543 + (RANDOM() * 0.01 - 0.005)
            WHEN location ILIKE '%south b%' THEN 36.8350 + (RANDOM() * 0.008 - 0.004)
            WHEN location ILIKE '%south c%' THEN 36.8250 + (RANDOM() * 0.008 - 0.004)
            WHEN location ILIKE '%ngong%' THEN 36.7700 + (RANDOM() * 0.01 - 0.005)
            ELSE 36.817223 + (RANDOM() * 0.02 - 0.01)
          END
        WHERE latitude IS NULL OR longitude IS NULL;
      `);
    } catch (e) {
      console.warn('Coordinate update notice:', e.message);
    }

    // 5. Automatically verify and seed the 25 detailed houses with 5+ photos each
    try {
      const { NEW_25_HOUSES } = require('../seed_25_houses');
      for (const h of NEW_25_HOUSES) {
        await query(
          `
          INSERT INTO houses (
            id, title, location, latitude, longitude, bedrooms, monthly_rent, deposit_amount,
            description, images, amenities, contact_name, contact_phone, contact_email, contact_role, status
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'AVAILABLE')
          ON CONFLICT (id) DO UPDATE SET
            latitude = EXCLUDED.latitude,
            longitude = EXCLUDED.longitude,
            images = EXCLUDED.images,
            description = EXCLUDED.description,
            title = EXCLUDED.title,
            monthly_rent = EXCLUDED.monthly_rent;
        `,
          [
            h.id,
            h.title,
            h.location,
            h.latitude,
            h.longitude,
            h.bedrooms,
            h.monthlyRent,
            h.depositAmount,
            h.description,
            h.images,
            h.amenities,
            h.contactName,
            h.contactPhone,
            h.contactEmail,
            h.contactRole,
          ]
        );
      }
    } catch (seedErr) {
      console.warn('Auto-seed notice:', seedErr.message);
    }

    console.log('PostgreSQL database tables and houses with coordinates verified and ready.');
  } catch (err) {
    console.error('Database auto-initialization error:', err);
  }
}

initDB();

module.exports = { query };
