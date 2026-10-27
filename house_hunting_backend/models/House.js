// models/House.js
const db = require('../database/db');

class House {
  // Helper: Generate realistic coordinates in Nairobi based on neighborhood name
  static getCoordinatesForLocation(location = '') {
    const loc = (location || '').toLowerCase();
    const coordsMap = {
      westlands: { lat: -1.2683, lng: 36.8044 },
      kilimani: { lat: -1.2921, lng: 36.7865 },
      kileleshwa: { lat: -1.2796, lng: 36.7885 },
      karen: { lat: -1.3197, lng: 36.7065 },
      lavington: { lat: -1.2833, lng: 36.7667 },
      parklands: { lat: -1.2612, lng: 36.8206 },
      runda: { lat: -1.2155, lng: 36.8202 },
      muthaiga: { lat: -1.2520, lng: 36.8340 },
      'upper hill': { lat: -1.2995, lng: 36.8163 },
      upperhill: { lat: -1.2995, lng: 36.8163 },
      'south b': { lat: -1.3100, lng: 36.8350 },
      'south c': { lat: -1.3180, lng: 36.8250 },
      langata: { lat: -1.3532, lng: 36.7543 },
      "lang'ata": { lat: -1.3532, lng: 36.7543 },
      ngong: { lat: -1.3000, lng: 36.7700 },
      riara: { lat: -1.2980, lng: 36.7750 },
    };

    for (const [key, val] of Object.entries(coordsMap)) {
      if (loc.includes(key)) {
        const jitterLat = (Math.random() - 0.5) * 0.008;
        const jitterLng = (Math.random() - 0.5) * 0.008;
        return {
          latitude: Number((val.lat + jitterLat).toFixed(6)),
          longitude: Number((val.lng + jitterLng).toFixed(6)),
        };
      }
    }

    // Default Nairobi coordinates with slight random offset
    return {
      latitude: Number((-1.286389 + (Math.random() - 0.5) * 0.015).toFixed(6)),
      longitude: Number((36.817223 + (Math.random() - 0.5) * 0.015).toFixed(6)),
    };
  }

  // 1. Used by endpoint to add a new house to the database
  static async create({
    id,
    title,
    location,
    latitude,
    longitude,
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
    
    // Auto-generate coordinates if not provided
    let finalLat = latitude;
    let finalLng = longitude;
    if (finalLat === undefined || finalLat === null || finalLng === undefined || finalLng === null) {
      const generated = House.getCoordinatesForLocation(location);
      finalLat = generated.latitude;
      finalLng = generated.longitude;
    }

    const query = `
      INSERT INTO houses (
        id, title, location, latitude, longitude, bedrooms, monthly_rent, deposit_amount,
        description, images, amenities, contact_name, contact_phone,
        contact_email, contact_role
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *;
    `;
    const params = [
      houseId,
      title,
      location,
      finalLat,
      finalLng,
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

  // 2. Search available houses for Gemini's search tool & explore page
  // CRITICAL: Houses that are BOOKED, or currently locked (PENDING_PAYMENT), are excluded!
  static async search({ location, maxRent, bedrooms }) {
    let sql = `
      SELECT id, title, location, latitude, longitude, bedrooms, monthly_rent, deposit_amount, 
             description, images, amenities, contact_name, contact_phone, contact_email, contact_role, status 
      FROM houses 
      WHERE (status = 'AVAILABLE' AND (locked_until IS NULL OR locked_until < NOW()))
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
    if (bedrooms && bedrooms !== 'all') {
      params.push(bedrooms);
      sql += ` AND bedrooms = $${params.length}`;
    }

    sql += ` ORDER BY created_at DESC;`;

    const { rows } = await db.query(sql, params);
    return rows;
  }

  // 3. Fetch single house details (includes contact info to call/chat & coordinates)
  static async getById(houseId) {
    const { rows } = await db.query('SELECT * FROM houses WHERE id = $1', [houseId]);
    return rows[0] || null;
  }

  // 4. Update coordinates specifically
  static async updateCoordinates(houseId, latitude, longitude) {
    const { rows } = await db.query(
      `UPDATE houses SET latitude = $2, longitude = $3 WHERE id = $1 RETURNING *;`,
      [houseId, latitude, longitude]
    );
    return rows[0] || null;
  }

  // 5. Atomic Lock: Reserves house for 15 minutes during PayPal checkout
  static async lockHouse(houseId, userId, lockMinutes = 15) {
    const query = `
      UPDATE houses
      SET status = 'PENDING_PAYMENT',
          locked_until = NOW() + ($2 || ' minutes')::INTERVAL,
          locked_by = $3
      WHERE id = $1
        AND (status = 'AVAILABLE' OR (status = 'PENDING_PAYMENT' AND locked_until < NOW()))
      RETURNING *;
    `;
    const { rows } = await db.query(query, [houseId, lockMinutes, userId]);
    return rows[0] || null;
  }

  // 6. Release lock if user cancels checkout or order fails
  static async releaseLock(houseId) {
    await db.query(`
      UPDATE houses
      SET status = 'AVAILABLE', locked_until = NULL, locked_by = NULL
      WHERE id = $1 AND status = 'PENDING_PAYMENT';
    `, [houseId]);
  }

  // 7. Finalize booking when PayPal payment is captured
  static async markBooked(houseId) {
    await db.query(`
      UPDATE houses
      SET status = 'BOOKED', locked_until = NULL, locked_by = NULL
      WHERE id = $1;
    `, [houseId]);
  }

  // 8. Reset back to AVAILABLE when lease concludes
  static async markAvailable(houseId) {
    await db.query(`
      UPDATE houses
      SET status = 'AVAILABLE', locked_until = NULL, locked_by = NULL
      WHERE id = $1;
    `, [houseId]);
  }
}

module.exports = House;
