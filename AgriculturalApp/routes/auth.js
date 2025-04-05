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
  failureRedirect: '/login',
  failureFlash: true
}), (req, res) => {
  console.log('Zalogowany użytkownik:', req.user);
  if (req.user && req.user.role === 'admin') {
    return res.redirect('/admin');
  } else if (req.user && req.user.role === 'user') {
    return res.redirect('/user');
  } else {
    return res.redirect('/login');
  }
});

// Wylogowanie
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


module.exports = router;
