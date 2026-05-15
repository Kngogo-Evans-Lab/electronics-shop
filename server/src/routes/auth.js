// server/routes/auth.js
// Covers: register, login, google, send-otp, verify-otp,
//         change-password, forgot-password, reset-password,
//         verify-phone, toggle-2fa, login-alerts, delete-account

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');
const nodemailer = require('nodemailer');
const AfricasTalking = require('africastalking');

const User   = require('../models/User');
const router = express.Router();

// ── config ─────────────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || 'techstore_secret_key_2024';
const CLIENT_URL = process.env.CLIENT_URL  || 'http://localhost:5173';

// ── Africa's Talking ───────────────────────────────────────────────────────────
const AT = AfricasTalking({
  apiKey:   process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,   // use 'sandbox' for testing
});
const sms = AT.SMS;

// ── Nodemailer (Gmail example — swap for any SMTP) ─────────────────────────────
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,   // use an App Password, not your real password
  },
});

// ── helpers ────────────────────────────────────────────────────────────────────
const genOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const hashOtp = (otp) =>
  crypto.createHash('sha256').update(otp).digest('hex');

const makeToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(header.replace('Bearer ', ''), JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: 'Token expired or invalid' });
  }
};

const getDeviceInfo = (req) => {
  const ua = req.headers['user-agent'] || '';
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  let device = 'Unknown Device';
  if (/mobile/i.test(ua))      device = 'Mobile';
  else if (/tablet/i.test(ua)) device = 'Tablet';
  else if (/windows/i.test(ua)) device = 'Windows PC';
  else if (/mac/i.test(ua))    device = 'Mac';
  else if (/linux/i.test(ua))  device = 'Linux';
  return { ip: ip.split(',')[0].trim(), device };
};

const sendEmail = async (to, subject, html) => {
  await mailer.sendMail({
    from: `"TechStore" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

const sendSms = async (to, message) => {
  // Africa's Talking requires numbers in international format e.g. +254712345678
  const formatted = to.startsWith('+') ? to : `+${to}`;
  await sms.send({ to: [formatted], message });
};

// ══════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// ── SEND OTP (email or phone) ─────────────────────────────────────────────────
// Body: { type: 'email'|'phone', email?, phone?, purpose? }
// purpose defaults to 'email-verify' or 'phone-verify'
router.post('/send-otp', async (req, res) => {
  const { type, email, phone, purpose } = req.body;
  try {
    const otp     = genOtp();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    if (type === 'email') {
      if (!email) return res.status(400).json({ error: 'Email is required' });
      // Upsert a temp record or find existing user
      let user = await User.findOne({ email });

      // For registration flow the user may not exist yet — store otp in a
      // short-lived cache. We use a temp "pending" user approach here.
      // If user doesn't exist (new registration) just respond with success;
      // the OTP is validated during /register which re-hashes and checks.
      const otpHash = hashOtp(otp);
      if (user) {
        user.otpHash    = otpHash;
        user.otpExpires = expires;
        user.otpPurpose = purpose || 'email-verify';
        await user.save();
      }
      // For new registrations cache the hash temporarily using a temp doc
      else {
        // Store in a lightweight temp record (you can also use Redis)
        await User.create({
          name:       '__pending__',
          email,
          otpHash,
          otpExpires: expires,
          otpPurpose: 'email-verify',
        });
      }

      await sendEmail(email, 'Your TechStore verification code', `
        <div style="font-family:sans-serif;max-width:480px;margin:auto">
          <h2 style="color:#1d4ed8">Your verification code</h2>
          <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#111">${otp}</p>
          <p style="color:#666">This code expires in <strong>10 minutes</strong>.</p>
          <p style="color:#999;font-size:12px">If you didn't request this, ignore this email.</p>
        </div>
      `);
      return res.json({ message: 'OTP sent to email' });
    }

    if (type === 'phone') {
      if (!phone) return res.status(400).json({ error: 'Phone is required' });
      let user = await User.findOne({ phone });
      if (!user) return res.status(404).json({ error: 'Phone not found on any account' });

      user.otpHash    = hashOtp(otp);
      user.otpExpires = expires;
      user.otpPurpose = purpose || 'phone-verify';
      await user.save();

      await sendSms(phone, `Your TechStore code: ${otp}. Expires in 10 minutes.`);
      return res.json({ message: 'OTP sent via SMS' });
    }

    res.status(400).json({ error: 'type must be email or phone' });
  } catch (err) {
    console.error('send-otp error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// ── REGISTER (with email OTP verification) ────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password, otp } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user && user.name !== '__pending__' && user.emailVerified) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Validate OTP
    if (!user || !user.otpHash || !user.otpExpires) {
      return res.status(400).json({ error: 'No OTP found. Please request a new code.' });
    }
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new code.' });
    }
    if (user.otpHash !== hashOtp(otp)) {
      return res.status(400).json({ error: 'Invalid code. Please try again.' });
    }

    const hashedPw = await bcrypt.hash(password, 10);

    // If this was a temp pending record, update it; otherwise create fresh
    user.name          = name;
    user.password      = hashedPw;
    user.emailVerified = true;
    user.otpHash       = undefined;
    user.otpExpires    = undefined;
    user.otpPurpose    = undefined;
    await user.save();

    res.json({ message: 'Account created successfully' });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── LOGIN ──────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.name === '__pending__') {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (!user.password) return res.status(400).json({ message: 'Use Google login' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // ── 2FA check ──────────────────────────────────────────────────────────
    if (user.twoFAEnabled && user.twoFAPhone) {
      const otp     = genOtp();
      user.otpHash    = hashOtp(otp);
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      user.otpPurpose = '2fa';
      await user.save();
      await sendSms(user.twoFAPhone, `TechStore 2FA code: ${otp}. Expires in 10 minutes.`);
      return res.json({ requires2FA: true, userId: user._id });
    }

    // ── login alerts ───────────────────────────────────────────────────────
    if (user.loginAlertsEnabled) {
      const { ip, device } = getDeviceInfo(req);
      user.loginHistory.unshift({ ip, device, at: new Date() });
      if (user.loginHistory.length > 10) user.loginHistory = user.loginHistory.slice(0, 10);
      await user.save();
      await sendEmail(user.email, 'New login to your TechStore account', `
        <div style="font-family:sans-serif;max-width:480px;margin:auto">
          <h2 style="color:#1d4ed8">New Login Detected</h2>
          <p>A new login was detected on your account.</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="color:#666;padding:4px 0">Device</td><td><strong>${device}</strong></td></tr>
            <tr><td style="color:#666;padding:4px 0">IP Address</td><td><strong>${ip}</strong></td></tr>
            <tr><td style="color:#666;padding:4px 0">Time</td><td><strong>${new Date().toUTCString()}</strong></td></tr>
          </table>
          <p style="color:#999;font-size:12px;margin-top:16px">If this wasn't you, change your password immediately.</p>
        </div>
      `);
    }

    const token = makeToken(user._id);
    res.json({
      token,
      user: {
        id:            user._id,
        name:          user.name,
        email:         user.email,
        phone:         user.phone,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        twoFAEnabled:  user.twoFAEnabled,
        loginAlertsEnabled: user.loginAlertsEnabled,
      },
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── VERIFY 2FA OTP (called after login when 2FA is on) ────────────────────────
router.post('/verify-2fa', async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.otpHash || user.otpExpires < new Date() || user.otpPurpose !== '2fa') {
      return res.status(400).json({ error: 'OTP expired. Please log in again.' });
    }
    if (user.otpHash !== hashOtp(otp)) {
      return res.status(400).json({ error: 'Invalid code' });
    }
    user.otpHash = undefined; user.otpExpires = undefined; user.otpPurpose = undefined;
    await user.save();

    const token = makeToken(user._id);
    res.json({
      token,
      user: {
        id: user._id, name: user.name, email: user.email,
        phone: user.phone, emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified, twoFAEnabled: user.twoFAEnabled,
        loginAlertsEnabled: user.loginAlertsEnabled,
      },
    });
  } catch (err) {
    console.error('verify-2fa error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GOOGLE AUTH ────────────────────────────────────────────────────────────────
router.post('/google', async (req, res) => {
  const { email, name, credential } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, googleId: credential, emailVerified: true });
    } else {
      if (!user.googleId) { user.googleId = credential; await user.save(); }
    }
    const token = makeToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, emailVerified: true },
    });
  } catch (err) {
    console.error('google auth error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── FORGOT PASSWORD — send reset email ────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    // Always respond success to prevent email enumeration
    if (!user || user.name === '__pending__') {
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }
    const rawToken    = crypto.randomBytes(32).toString('hex');
    user.resetToken   = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${CLIENT_URL}/reset-password?token=${rawToken}`;
    await sendEmail(email, 'Reset your TechStore password', `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#1d4ed8">Reset your password</h2>
        <p>Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#1d4ed8;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0">Reset Password</a>
        <p style="color:#999;font-size:12px">If you didn't request this, ignore this email.</p>
      </div>
    `);
    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('forgot-password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── RESET PASSWORD (from link) ────────────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetToken:   hashedToken,
      resetExpires: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ error: 'Reset link is invalid or expired.' });

    user.password     = await bcrypt.hash(newPassword, 10);
    user.resetToken   = undefined;
    user.resetExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error('reset-password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// PROTECTED ROUTES  (require Authorization: Bearer <token>)
// ══════════════════════════════════════════════════════════════════════════════

// ── CHANGE PASSWORD ───────────────────────────────────────────────────────────
router.post('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.password) return res.status(400).json({ error: 'Google accounts cannot use password change' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });
    if (newPassword.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('change-password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── SEND EMAIL VERIFICATION (re-send for logged-in user) ──────────────────────
router.post('/send-email-verify', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.emailVerified) return res.status(400).json({ error: 'Email already verified' });

    const otp         = genOtp();
    user.otpHash      = hashOtp(otp);
    user.otpExpires   = new Date(Date.now() + 10 * 60 * 1000);
    user.otpPurpose   = 'email-verify';
    await user.save();

    await sendEmail(user.email, 'Verify your TechStore email', `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#1d4ed8">Email Verification</h2>
        <p>Your verification code is:</p>
        <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#111">${otp}</p>
        <p style="color:#666">Expires in <strong>10 minutes</strong>.</p>
      </div>
    `);
    res.json({ message: 'Verification code sent to your email' });
  } catch (err) {
    console.error('send-email-verify error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── VERIFY EMAIL OTP (logged-in) ──────────────────────────────────────────────
router.post('/verify-email', authMiddleware, async (req, res) => {
  const { otp } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.otpHash || user.otpExpires < new Date() || user.otpPurpose !== 'email-verify') {
      return res.status(400).json({ error: 'OTP expired or not found. Request a new one.' });
    }
    if (user.otpHash !== hashOtp(otp)) {
      return res.status(400).json({ error: 'Invalid code' });
    }
    user.emailVerified = true;
    user.otpHash = undefined; user.otpExpires = undefined; user.otpPurpose = undefined;
    await user.save();
    res.json({ message: 'Email verified successfully', emailVerified: true });
  } catch (err) {
    console.error('verify-email error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── SEND PHONE OTP ────────────────────────────────────────────────────────────
router.post('/send-phone-otp', authMiddleware, async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const otp         = genOtp();
    user.phone        = phone;
    user.otpHash      = hashOtp(otp);
    user.otpExpires   = new Date(Date.now() + 10 * 60 * 1000);
    user.otpPurpose   = 'phone-verify';
    await user.save();

    await sendSms(phone, `TechStore verification code: ${otp}. Expires in 10 minutes.`);
    res.json({ message: 'OTP sent to phone' });
  } catch (err) {
    console.error('send-phone-otp error:', err);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

// ── VERIFY PHONE OTP ──────────────────────────────────────────────────────────
router.post('/verify-phone', authMiddleware, async (req, res) => {
  const { otp } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.otpHash || user.otpExpires < new Date() || user.otpPurpose !== 'phone-verify') {
      return res.status(400).json({ error: 'OTP expired or not found. Request a new one.' });
    }
    if (user.otpHash !== hashOtp(otp)) {
      return res.status(400).json({ error: 'Invalid code' });
    }
    user.phoneVerified = true;
    user.otpHash = undefined; user.otpExpires = undefined; user.otpPurpose = undefined;
    await user.save();
    res.json({ message: 'Phone verified successfully', phoneVerified: true });
  } catch (err) {
    console.error('verify-phone error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── ENABLE / DISABLE 2FA ──────────────────────────────────────────────────────
// Step 1: Send OTP to provided phone number
router.post('/2fa/send', authMiddleware, async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const otp         = genOtp();
    user.twoFAPhone   = phone;
    user.otpHash      = hashOtp(otp);
    user.otpExpires   = new Date(Date.now() + 10 * 60 * 1000);
    user.otpPurpose   = '2fa-setup';
    await user.save();

    await sendSms(phone, `TechStore 2FA setup code: ${otp}. Expires in 10 minutes.`);
    res.json({ message: '2FA setup code sent to phone' });
  } catch (err) {
    console.error('2fa/send error:', err);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

// Step 2: Confirm OTP → enable 2FA
router.post('/2fa/enable', authMiddleware, async (req, res) => {
  const { otp } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.otpHash || user.otpExpires < new Date() || user.otpPurpose !== '2fa-setup') {
      return res.status(400).json({ error: 'OTP expired or not found. Request a new one.' });
    }
    if (user.otpHash !== hashOtp(otp)) {
      return res.status(400).json({ error: 'Invalid code' });
    }
    user.twoFAEnabled = true;
    user.otpHash = undefined; user.otpExpires = undefined; user.otpPurpose = undefined;
    await user.save();
    res.json({ message: '2FA enabled successfully', twoFAEnabled: true });
  } catch (err) {
    console.error('2fa/enable error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Disable 2FA
router.post('/2fa/disable', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.twoFAEnabled = false;
    user.twoFAPhone   = '';
    await user.save();
    res.json({ message: '2FA disabled', twoFAEnabled: false });
  } catch (err) {
    console.error('2fa/disable error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── LOGIN ALERTS ──────────────────────────────────────────────────────────────
router.post('/login-alerts', authMiddleware, async (req, res) => {
  const { enabled } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.loginAlertsEnabled = !!enabled;
    await user.save();
    res.json({ message: `Login alerts ${enabled ? 'enabled' : 'disabled'}`, loginAlertsEnabled: user.loginAlertsEnabled });
  } catch (err) {
    console.error('login-alerts error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET login history
router.get('/login-history', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('loginHistory loginAlertsEnabled');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ loginHistory: user.loginHistory, loginAlertsEnabled: user.loginAlertsEnabled });
  } catch (err) {
    console.error('login-history error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── DELETE ACCOUNT ────────────────────────────────────────────────────────────
router.delete('/account', authMiddleware, async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Password is incorrect' });
    }
    await User.findByIdAndDelete(req.userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('delete-account error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;