// routes/users.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Widok wszystkich użytkowników
router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.render('users', { users });
});

module.exports = router;
