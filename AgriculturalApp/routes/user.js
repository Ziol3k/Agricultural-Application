const express = require('express');
const { Reservation, Machine } = require('../models'); // Importujemy modele
const router = express.Router();
const { isUser } = require('../middleware/authMiddleware'); // Zaimportowanie isUser

// Strona główna dla użytkownika
router.get('/', isUser, (req, res) => {  // Dodanie middleware isUser
  res.render('user', { title: 'Panel Użytkownika' });
});

// Wyświetlanie rezerwacji użytkownika
router.get('/reservations', isUser, async (req, res) => {  // Dodanie middleware isUser
  const reservations = await Reservation.findAll({
    where: { userId: req.user.id },
    include: Machine
  });
  res.render('user/reservations', { title: 'Twoje Rezerwacje', reservations });
});

// Dodawanie rezerwacji
router.post('/reservations', isUser, async (req, res) => {  // Dodanie middleware isUser
  const { machineId, date } = req.body;
  await Reservation.create({
    machineId,
    userId: req.user.id,
    date
  });
  res.redirect('/user/reservations');
});

// Usuwanie rezerwacji
router.post('/reservations/delete/:id', isUser, async (req, res) => {  // Dodanie middleware isUser
  const reservationId = req.params.id;
  await Reservation.destroy({ where: { id: reservationId } });
  res.redirect('/user/reservations');
});

module.exports = router;