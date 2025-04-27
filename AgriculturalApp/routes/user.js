const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isUser } = require("../middleware/authMiddleware");

// Strona główna użytkownika
router.get("/", isUser, userController.getUserHome);

// Rezerwacja maszyny
router.post("/reserve", isUser, userController.makeReservation);

// Usunięcie rezerwacji
router.get("/reservations/delete", isUser, userController.deleteReservation);

// Edytowanie rezerwacji
router.post("/reservations/edit", isUser, userController.editReservation);

// Lista rezerwacji użytkownika
router.get("/reservations", isUser, userController.getUserReservations);

// Sprawdzenie dostępnych terminów dla maszyny
router.get("/reservations/:machineId", isUser, userController.getReservedDates);

module.exports = router;
