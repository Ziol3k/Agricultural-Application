const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Strona logowania
router.get("/login", authController.renderLoginPage);

// Obsługa logowania (po przesłaniu formularza)
router.post(
  "/login",
  authController.handleLogin,
  authController.postLoginRedirect
);

// Wylogowanie użytkownika
router.get("/logout", authController.logout);

module.exports = router;
