// routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Strona logowania
router.get('/login', (req, res) => {
  res.render('login');
});

// Obsługa logowania
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

module.exports = router;
