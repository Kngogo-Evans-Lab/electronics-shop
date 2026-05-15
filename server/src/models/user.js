// server/models/User.js
const mongoose = require('mongoose');

const loginAlertSchema = new mongoose.Schema({
  ip:        { type: String },
  device:    { type: String },
  location:  { type: String },
  at:        { type: Date, default: Date.now },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:    { type: String, trim: true, default: '' },
  password: { type: String },          // blank for Google login
  googleId: { type: String },

  // ── verification flags ────────────────────────────────────────────────────
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },

  // ── 2FA ───────────────────────────────────────────────────────────────────
  twoFAEnabled:  { type: Boolean, default: false },
  twoFAPhone:    { type: String, default: '' },   // phone used for 2FA SMS

  // ── login alerts ──────────────────────────────────────────────────────────
  loginAlertsEnabled: { type: Boolean, default: false },
  loginHistory:       { type: [loginAlertSchema], default: [] },

  // ── OTP / reset tokens (stored hashed) ───────────────────────────────────
  otpHash:       { type: String },
  otpExpires:    { type: Date },
  otpPurpose:    { type: String },   // 'email-verify' | 'phone-verify' | '2fa' | 'reset'

  resetToken:    { type: String },
  resetExpires:  { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);