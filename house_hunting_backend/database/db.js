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

    // 2. Auto-create Bookings table
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
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        paid_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
      );
    `);

    // 3. Auto-seed sample houses if table is empty
    const { rows } = await query('SELECT COUNT(*) FROM houses');
    if (parseInt(rows[0].count) === 0) {
      await query(`
        INSERT INTO houses (
          id, title, location, bedrooms, monthly_rent, deposit_amount, 
          description, images, amenities, contact_name, contact_phone, contact_email, contact_role
        ) VALUES 
        (
          'house_1', 
          'Modern 2-Bedroom with Balcony', 
          'Westlands', 
          2, 
          750.00, 
          150.00, 
          'Spacious modern apartment with master ensuite, natural lighting, and perimeter electric fence.',
          ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'],
          ARRAY['High-Speed WiFi', 'Backup Generator', 'Dedicated Parking', '24/7 Security'],
          'Samuel Mwangi',
          '+254712345678',
          'samuel.caretaker@example.com',
          'Caretaker'
        ),
        (
          'house_2', 
          'Cozy Studio Apartment near Mall', 
          'Kilimani', 
          1, 
          400.00, 
          100.00, 
          'Quiet, furnished studio apartment perfect for young professionals. Walking distance to supermarkets.',
          ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', 'https://images.unsplash.com/photo-1484154218962-a197022b5858'],
          ARRAY['Borehole Water', 'CCTV Surveillance', 'Balcony', 'Elevator'],
          'Grace Wanjiku',
          '+254798765432',
          'grace.landlord@example.com',
          'Landlord'
        ),
        (
          'house_3', 
          'Charming 3-Bedroom Family Villa', 
          'Karen', 
          3, 
          1200.00, 
          250.00, 
          'Stand-alone villa situated inside a private gated community. Large green yard and children play area.',
          ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'],
          ARRAY['Private Garden', 'Pet Friendly', 'Solar Water Heating', 'Perimeter Wall'],
          'David Kiprop',
          '+254722112233',
          'david.agent@example.com',
          'Property Manager'
        );
      `);
      console.log('Sample rental listings auto-populated with contact details.');
    }

    console.log('Database tables verified and ready.');
  } catch (err) {
    console.error('Database auto-initialization error:', err);
  }
}

initDB();

module.exports = { query };