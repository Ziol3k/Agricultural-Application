// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.renderLoginPage);
router.post('/login', authController.handleLogin, authController.postLoginRedirect);
router.get('/logout', authController.logout);

module.exports = router;
