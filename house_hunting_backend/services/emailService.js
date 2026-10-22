// services/emailService.js
// Handles all transactional emails using Resend REST API (https://api.resend.com/emails)

function getResendApiKey() {
  const rawKey = process.env.RESEND_API_KEY || process.env.RESEND || '';
  return rawKey.replace(/[;"]/g, '').trim();
}

/**
 * Sends an email using the Resend REST API
 */
async function sendResendEmail({ to, subject, html }) {
  const apiKey = getResendApiKey();
  if (!apiKey) {
    console.warn('[EmailService] RESEND_API_KEY is not set. Simulating email dispatch to:', to);
    console.log(`[EmailService] Subject: ${subject}`);
    return { success: true, simulated: true };
  }

  try {
    const fromAddress = process.env.RESEND_FROM || 'HouseNest <onboarding@resend.dev>';
    const recipientList = Array.isArray(to) ? to : [to];

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: recipientList,
        subject: subject,
        html: html,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.warn('[EmailService] Resend notice:', data.message || data);
      return { success: false, error: data };
    }

    console.log(`[EmailService] Email dispatched successfully to ${to} (ID: ${data.id})`);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('[EmailService] Network error dispatching email:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 1. Send OTP / Password Reset Email
 */
async function sendOtpEmail(toEmail, otp) {
  const subject = 'NyumbaAi - Your Password Reset Verification Code';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; }
        .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
        .header { background: #2563eb; padding: 32px 24px; text-align: center; color: white; }
        .content { padding: 32px 28px; color: #334155; line-height: 1.6; }
        .otp-badge { background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 12px; font-size: 32px; font-weight: 800; letter-spacing: 6px; text-align: center; padding: 18px; color: #1d4ed8; margin: 24px 0; font-family: monospace; }
        .footer { background: #f1f5f9; padding: 18px; text-align: center; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">🏡 HouseNest AI</h1>
          <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">Password Reset Request</p>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>We received a request to reset your password for your HouseNest account. Use the one-time verification code below to complete the reset process:</p>
          <div class="otp-badge">${otp}</div>
          <p style="font-size: 13px; color: #64748b;">This code expires in <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email or contact support.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} HouseNest Inc. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  return sendResendEmail({ to: toEmail, subject, html });
}

/**
 * 2. Send Booking Confirmation Email
 */
async function sendBookingConfirmation(toEmail, booking, house) {
  const subject = `🎉 Lease Confirmed: ${house.title}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; padding: 24px; margin: 0; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
        .header { background: #16a34a; color: white; padding: 28px 24px; text-align: center; }
        .body { padding: 28px; color: #334155; }
        .summary { background: #f8fafc; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid #e2e8f0; }
        .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
        .caretaker-box { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 14px; margin-top: 18px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2 style="margin: 0;">Reservation & Payment Confirmed</h2>
          <p style="margin: 6px 0 0; opacity: 0.9;">Booking Ref: ${booking.booking_id || booking.bookingId}</p>
        </div>
        <div class="body">
          <p>Hi <strong>${booking.tenant_name || 'Valued Tenant'}</strong>,</p>
          <p>Your payment via PayPal was successfully captured and your tenancy has been locked!</p>
          
          <div class="summary">
            <h4 style="margin: 0 0 10px; color: #0f172a;">${house.title}</h4>
            <div class="row"><span>Location:</span><strong>${house.location}</strong></div>
            <div class="row"><span>Move-in Date:</span><strong>${booking.start_date}</strong></div>
            <div class="row"><span>Lease Duration:</span><strong>${booking.months_paid} Month(s)</strong></div>
            <div class="row"><span>Lease End Date:</span><strong>${booking.end_date}</strong></div>
            <div class="row" style="border-top: 1px solid #cbd5e1; margin-top: 8px; padding-top: 8px;">
              <span>Total Paid (USD):</span><strong style="color: #16a34a; font-size: 16px;">$${Number(booking.total_amount_paid).toFixed(2)}</strong>
            </div>
          </div>

          <div class="caretaker-box">
            <h5 style="margin: 0 0 4px; color: #065f46;">🔑 Key Handover Contact</h5>
            <p style="margin: 0; font-size: 14px;"><strong>${house.contact_name}</strong> (${house.contact_role})</p>
            <p style="margin: 4px 0 0; font-size: 14px;">Phone: <a href="tel:${house.contact_phone}">${house.contact_phone}</a></p>
            ${house.contact_email ? `<p style="margin: 2px 0 0; font-size: 14px;">Email: <a href="mailto:${house.contact_email}">${house.contact_email}</a></p>` : ''}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendResendEmail({ to: toEmail, subject, html });
}

/**
 * 3. Send 5-day Expiration Warning Email
 */
async function sendLeaseExpirationWarning(toEmail, booking, house, daysRemaining) {
  const subject = `⚠️ URGENT: Your lease for ${house.title} expires in ${daysRemaining} days`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fffbeb; padding: 24px; margin: 0; }
        .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #fde68a; overflow: hidden; }
        .header { background: #d97706; color: white; padding: 24px; text-align: center; }
        .body { padding: 24px; color: #334155; line-height: 1.6; }
        .warning-box { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 10px; padding: 16px; margin: 16px 0; font-weight: 500; }
        .contact-btn { display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2 style="margin: 0;">⚠️ Lease Expiring Soon</h2>
          <p style="margin: 6px 0 0; font-size: 14px;">${daysRemaining} Days Remaining Until End Date</p>
        </div>
        <div class="body">
          <p>Dear <strong>${booking.tenant_name}</strong>,</p>
          <div class="warning-box">
            Your tenancy period for <strong>${house.title}</strong> in ${house.location} is set to end on <strong>${booking.end_date}</strong> (${daysRemaining} days from today).
          </div>
          <p>Please note that if the lease is not renewed within 5 days after your end date, the property will automatically be removed from your active reservations and reopened as <strong>AVAILABLE</strong> for new tenants.</p>
          <p>To renew your lease or arrange move-out inspection, contact the caretaker immediately:</p>
          <p>
            <strong>${house.contact_name}</strong> (${house.contact_role})<br/>
            Phone: <a href="tel:${house.contact_phone}">${house.contact_phone}</a><br/>
            ${house.contact_email ? `Email: <a href="mailto:${house.contact_email}">${house.contact_email}</a>` : ''}
          </p>
          ${house.contact_email ? `<a href="mailto:${house.contact_email}?subject=Lease%20Renewal%20${booking.booking_id}" class="contact-btn">✉️ Contact Landlord to Renew</a>` : ''}
        </div>
      </div>
    </body>
    </html>
  `;

  return sendResendEmail({ to: toEmail, subject, html });
}

/**
 * 4. Send Notice when Lease has fully expired & House returned to Available
 */
async function sendLeaseExpiredNotice(toEmail, booking, house) {
  const subject = `Notice: Tenancy Concluded for ${house.title}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; padding: 24px; margin: 0; }
        .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
        .header { background: #475569; color: white; padding: 24px; text-align: center; }
        .body { padding: 24px; color: #334155; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2 style="margin: 0;">Tenancy Period Completed</h2>
          <p style="margin: 6px 0 0; font-size: 14px;">House Released to Available Market</p>
        </div>
        <div class="body">
          <p>Dear <strong>${booking.tenant_name}</strong>,</p>
          <p>Your lease for <strong>${house.title}</strong> ended on <strong>${booking.end_date}</strong>. As 5 days have passed without renewal, the listing has been marked as <strong>AVAILABLE</strong> for new prospective tenants.</p>
          <p>Thank you for using HouseNest. If you are looking for your next home or apartment, visit HouseNest anytime to discover new verified listings.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendResendEmail({ to: toEmail, subject, html });
}

module.exports = {
  sendResendEmail,
  sendOtpEmail,
  sendBookingConfirmation,
  sendLeaseExpirationWarning,
  sendLeaseExpiredNotice,
};

