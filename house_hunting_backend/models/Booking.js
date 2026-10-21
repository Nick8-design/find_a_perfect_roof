// models/Booking.js
const db = require('../database/db');

class Booking {
  // 1. Create a booking with multi-month rent and calculated end_date
  static async create({
    bookingId,
    houseId,
    userId,
    tenantName,
    tenantPhone,
    tenantEmail,
    monthsPaid = 1,
    monthlyRent,
    depositAmount = 0,
    startDate, // Format: 'YYYY-MM-DD'
    tenantNotes = '',
    currency = 'USD',
  }) {
    const numMonths = parseInt(monthsPaid, 10) || 1;
    const rent = parseFloat(monthlyRent);
    const deposit = parseFloat(depositAmount) || 0;

    // Calculate totals
    const totalRentAmount = rent * numMonths;
    const totalAmountPaid = totalRentAmount + deposit;

    // Calculate end_date in JavaScript
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + numMonths);
    const endDate = end.toISOString().split('T')[0];

    const query = `
      INSERT INTO bookings (
        booking_id, house_id, user_id, tenant_name, tenant_phone, tenant_email,
        months_paid, monthly_rent, total_rent_amount, deposit_amount, total_amount_paid, currency,
        start_date, end_date, tenant_notes, status
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, 'PENDING'
      )
      RETURNING *;
    `;

    const params = [
      bookingId,
      houseId,
      userId,
      tenantName,
      tenantPhone,
      tenantEmail,
      numMonths,
      rent,
      totalRentAmount,
      deposit,
      totalAmountPaid,
      currency,
      startDate,
      endDate,
      tenantNotes,
    ];

    const { rows } = await db.query(query, params);
    return rows[0];
  }

  // 2. Link PayPal Order ID when order is initialized
  static async attachPayPalOrder(bookingId, paypalOrderId) {
    await db.query(`
      UPDATE bookings 
      SET paypal_order_id = $2 
      WHERE booking_id = $1;
    `, [bookingId, paypalOrderId]);
  }

  // 3. Mark as paid when capture succeeds, recording PayPal receipt details
  static async markPaid(bookingId, { captureId, payerId, payerEmail }) {
    const query = `
      UPDATE bookings
      SET status = 'PAID',
          paypal_capture_id = $2,
          paypal_payer_id = $3,
          paypal_payer_email = $4,
          paid_at = CURRENT_TIMESTAMP
      WHERE booking_id = $1
      RETURNING *;
    `;
    const { rows } = await db.query(query, [bookingId, captureId, payerId, payerEmail]);
    return rows[0];
  }

  // 4. Mark as failed or cancelled if user cancels checkout
  static async markFailed(bookingId, status = 'CANCELLED') {
    await db.query(`
      UPDATE bookings 
      SET status = $2 
      WHERE booking_id = $1;
    `, [bookingId, status]);
  }

  // 5. Look up booking by PayPal Order ID
  static async getByPayPalOrderId(paypalOrderId) {
    const { rows } = await db.query(`
      SELECT b.*, h.title as house_title, h.location as house_location, 
             h.contact_phone as caretaker_phone, h.contact_email as caretaker_email
      FROM bookings b
      JOIN houses h ON b.house_id = h.id
      WHERE b.paypal_order_id = $1;
    `, [paypalOrderId]);
    return rows[0] || null;
  }

  // 6. Look up booking by bookingId
  static async getById(bookingId) {
    const { rows } = await db.query(`
      SELECT b.*, h.title as house_title, h.location as house_location, 
             h.images as house_images, h.contact_name, h.contact_phone, h.contact_email, h.contact_role
      FROM bookings b
      JOIN houses h ON b.house_id = h.id
      WHERE b.booking_id = $1;
    `, [bookingId]);
    return rows[0] || null;
  }

  // 7. Get tenant's bookings with full details & calculated days remaining
  static async getUserBookings(userId) {
    const { rows } = await db.query(`
      SELECT b.*, 
             h.title as house_title, 
             h.location as house_location, 
             h.images as house_images,
             h.description as house_description,
             h.amenities as house_amenities,
             h.contact_name as caretaker_name, 
             h.contact_phone as caretaker_phone,
             h.contact_email as caretaker_email,
             h.contact_role as caretaker_role,
             (b.end_date - CURRENT_DATE) as days_remaining
      FROM bookings b
      JOIN houses h ON b.house_id = h.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC;
    `, [userId]);
    return rows;
  }
}

module.exports = Booking;
