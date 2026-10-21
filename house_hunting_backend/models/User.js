// models/User.js
const db = require('../database/db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ name, email, phone = null, password, avatar = null, role = 'USER' }) {
    const userId = `user_${Date.now()}`;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO users (id, name, email, phone, password_hash, avatar, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, email, phone, avatar, role, created_at;
    `;

    const { rows } = await db.query(query, [
      userId,
      name.trim(),
      email.toLowerCase().trim(),
      phone ? phone.trim() : null,
      passwordHash,
      avatar,
      role,
    ]);

    return rows[0];
  }

  static async findByEmail(email) {
    const { rows } = await db.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );
    return rows[0] || null;
  }

  static async findById(id) {
    const { rows } = await db.query(
      'SELECT id, name, email, phone, avatar, role, created_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  }

  static async comparePassword(plainPassword, passwordHash) {
    return bcrypt.compare(plainPassword, passwordHash);
  }

  static async updateProfile(id, { name, phone, avatar }) {
    const fields = [];
    const params = [id];

    if (name !== undefined) {
      params.push(name.trim());
      fields.push(`name = $${params.length}`);
    }
    if (phone !== undefined) {
      params.push(phone ? phone.trim() : null);
      fields.push(`phone = $${params.length}`);
    }
    if (avatar !== undefined) {
      params.push(avatar);
      fields.push(`avatar = $${params.length}`);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $1
      RETURNING id, name, email, phone, avatar, role, created_at, updated_at;
    `;

    const { rows } = await db.query(query, params);
    return rows[0] || null;
  }

  static async setResetOtp(email, otp, expiryMinutes = 15) {
    const query = `
      UPDATE users
      SET reset_otp = $2,
          reset_otp_expiry = NOW() + ($3::text || ' minutes')::interval
      WHERE LOWER(email) = LOWER($1)
      RETURNING id, email;
    `;
    const { rows } = await db.query(query, [email.trim(), String(otp), String(expiryMinutes)]);
    return rows[0] || null;
  }

  static async verifyResetOtp(email, otp) {
    const query = `
      SELECT * FROM users
      WHERE LOWER(email) = LOWER($1)
        AND reset_otp = $2
        AND reset_otp_expiry > NOW();
    `;
    const { rows } = await db.query(query, [email.trim(), String(otp).trim()]);
    return rows[0] || null;
  }

  static async updatePasswordWithOtp(email, otp, newPassword) {
    const user = await this.verifyResetOtp(email, otp);
    if (!user) return null;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    const query = `
      UPDATE users
      SET password_hash = $2,
          reset_otp = NULL,
          reset_otp_expiry = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, name, email;
    `;
    const { rows } = await db.query(query, [user.id, passwordHash]);
    return rows[0] || null;
  }
}

module.exports = User;

