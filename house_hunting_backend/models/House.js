const db = require('../database/db');

class House {
  // 1. Used by your endpoint to add a new house to the database
  static async create({
    id,
    title,
    location,
    bedrooms,
    monthlyRent,
    depositAmount,
    description = '',
    images = [],
    amenities = [],
    contactName,
    contactPhone,
    contactEmail = null,
    contactRole = 'Caretaker',
  }) {
    const houseId = id || `house_${Date.now()}`;
    const query = `
      INSERT INTO houses (
        id, title, location, bedrooms, monthly_rent, deposit_amount,
        description, images, amenities, contact_name, contact_phone,
        contact_email, contact_role
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;
    const params = [
      houseId,
      title,
      location,
      bedrooms,
      monthlyRent,
      depositAmount,
      description,
      images,
      amenities,
      contactName,
      contactPhone,
      contactEmail,
      contactRole,
    ];
    const { rows } = await db.query(query, params);
    return rows[0];
  }

  // 2. Search available houses for Gemini's search tool
  static async search({ location, maxRent, bedrooms }) {
    let sql = `
      SELECT id, title, location, bedrooms, monthly_rent, deposit_amount, 
             description, images, amenities, contact_name, contact_phone, contact_role, status 
      FROM houses 
      WHERE (status = 'AVAILABLE' OR (status = 'PENDING_PAYMENT' AND locked_until < NOW()))
    `;
    const params = [];

    if (location) {
      params.push(`%${location}%`);
      sql += ` AND location ILIKE $${params.length}`;
    }
    if (maxRent) {
      params.push(maxRent);
      sql += ` AND monthly_rent <= $${params.length}`;
    }
    if (bedrooms) {
      params.push(bedrooms);
      sql += ` AND bedrooms = $${params.length}`;
    }

    const { rows } = await db.query(sql, params);
    return rows;
  }

  // 3. Fetch single house details (includes contact info to call/chat)
  static async getById(houseId) {
    const { rows } = await db.query('SELECT * FROM houses WHERE id = $1', [houseId]);
    return rows[0] || null;
  }

  // 4. Atomic Lock: Reserves house for 15 minutes during PayPal checkout
  static async lockHouse(houseId, userId, lockMinutes = 15) {
    const query = `
      UPDATE houses
      SET status = 'PENDING_PAYMENT',
          locked_until = NOW() + ($2 || ' minutes')::INTERVAL,
          locked_by = $3
      WHERE id = $1
        AND (status = 'AVAILABLE' OR locked_until < NOW())
      RETURNING *;
    `;
    const { rows } = await db.query(query, [houseId, lockMinutes, userId]);
    return rows[0] || null;
  }

  // 5. Release lock if user cancels checkout
  static async releaseLock(houseId) {
    await db.query(`
      UPDATE houses
      SET status = 'AVAILABLE', locked_until = NULL, locked_by = NULL
      WHERE id = $1 AND status = 'PENDING_PAYMENT';
    `, [houseId]);
  }

  // 6. Finalize booking when PayPal payment is captured
  static async markBooked(houseId) {
    await db.query(`
      UPDATE houses
      SET status = 'BOOKED', locked_until = NULL
      WHERE id = $1;
    `, [houseId]);
  }
}

module.exports = House;