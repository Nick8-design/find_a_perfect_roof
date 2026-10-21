// services/leaseCronService.js
const db = require('../database/db');
const emailService = require('./emailService');

/**
 * Runs inspection on all bookings to:
 * 1. Send warning emails to tenants 5 days before lease end date.
 * 2. If 5 days pass after lease end date, mark booking as EXPIRED and return house to AVAILABLE.
 */
async function checkAndProcessLeaseExpirations() {
  try {
    console.log('[LeaseCron] Checking lease statuses & expiration warnings...');

    // 1. Process 5-day expiration warnings
    // In PostgreSQL, subtracting two DATEs directly yields the integer number of days: (b.end_date - CURRENT_DATE)
    const warningQuery = `
      SELECT b.*, h.title as house_title, h.location as house_location,
             h.contact_name, h.contact_phone, h.contact_email, h.contact_role,
             (b.end_date - CURRENT_DATE) as days_remaining
      FROM bookings b
      JOIN houses h ON b.house_id = h.id
      WHERE b.status = 'PAID'
        AND (b.warning_sent IS FALSE OR b.warning_sent IS NULL)
        AND b.end_date >= CURRENT_DATE
        AND (b.end_date - CURRENT_DATE) <= 5;
    `;

    const { rows: warningBookings } = await db.query(warningQuery);

    for (const booking of warningBookings) {
      const daysRemaining = Math.max(0, parseInt(booking.days_remaining, 10));
      console.log(`[LeaseCron] Sending 5-day warning to ${booking.tenant_email} for ${booking.house_title} (${daysRemaining} days remaining)`);

      const house = {
        title: booking.house_title,
        location: booking.house_location,
        contact_name: booking.contact_name,
        contact_phone: booking.contact_phone,
        contact_email: booking.contact_email,
        contact_role: booking.contact_role,
      };

      if (booking.tenant_email) {
        await emailService.sendLeaseExpirationWarning(booking.tenant_email, booking, house, daysRemaining);
      }

      // Mark warning as sent
      await db.query(`UPDATE bookings SET warning_sent = TRUE WHERE booking_id = $1`, [booking.booking_id]);
    }

    // 2. Process expired bookings (5 days past lease end date)
    const expiredQuery = `
      SELECT b.*, h.title as house_title, h.location as house_location
      FROM bookings b
      JOIN houses h ON b.house_id = h.id
      WHERE b.status = 'PAID'
        AND CURRENT_DATE > (b.end_date + 5);
    `;

    const { rows: expiredBookings } = await db.query(expiredQuery);

    for (const booking of expiredBookings) {
      console.log(`[LeaseCron] Lease expired > 5 days for booking ${booking.booking_id}. Releasing house ${booking.house_id} back to AVAILABLE.`);

      // Update booking to EXPIRED
      await db.query(`UPDATE bookings SET status = 'EXPIRED' WHERE booking_id = $1`, [booking.booking_id]);

      // Release house back to AVAILABLE
      await db.query(`
        UPDATE houses 
        SET status = 'AVAILABLE',
            locked_until = NULL, 
            locked_by = NULL 
        WHERE id = $1
      `, [booking.house_id]);

      const house = {
        title: booking.house_title,
        location: booking.house_location,
      };

      if (booking.tenant_email) {
        await emailService.sendLeaseExpiredNotice(booking.tenant_email, booking, house);
      }
    }

    console.log(`[LeaseCron] Finished: ${warningBookings.length} warnings sent, ${expiredBookings.length} expired houses released.`);
    return {
      warningsSent: warningBookings.length,
      expiredReleased: expiredBookings.length,
    };
  } catch (error) {
    console.error('[LeaseCron] Error during lease expiration check:', error);
    return { error: error.message };
  }
}

// Start recurring cron runner (runs every 1 hour)
function startLeaseCron() {
  // Initial run 3 seconds after server boot
  setTimeout(() => {
    checkAndProcessLeaseExpirations();
  }, 3000);

  // Every 1 hour
  setInterval(() => {
    checkAndProcessLeaseExpirations();
  }, 60 * 60 * 1000);
}

module.exports = {
  checkAndProcessLeaseExpirations,
  startLeaseCron,
};

