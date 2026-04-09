// server/routes/google.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../passport'); // see next step
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "techstore_secret_key_2024";

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.redirect(`http://localhost:3000?token=${token}`);
  }
);

module.exports = router;