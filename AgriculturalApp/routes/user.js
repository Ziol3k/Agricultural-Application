const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isUser } = require('../middleware/authMiddleware');

// Strona główna użytkownika
router.get('/', isUser, userController.getUserHome);

// Tworzenie nowej rezerwacji
router.post('/reserve', isUser, userController.makeReservation);

// Ważne: najpierw DELETE
router.get('/reservations/delete', isUser, userController.deleteReservation);

// Edycja rezerwacji
router.post('/reservations/edit', isUser, userController.editReservation);

// Pobieranie wszystkich rezerwacji użytkownika
router.get('/reservations', isUser, userController.getUserReservations);

// Na końcu: pobieranie zajętych dat konkretnej maszyny
router.get('/reservations/:machineId', isUser, userController.getReservedDates);

module.exports = router;
