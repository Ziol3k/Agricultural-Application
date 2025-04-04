// routes/reservations.js
const express = require('express');
const router = express.Router();
const { Reservation, Machine } = require('../models');

// Trasa do wyświetlania rezerwacji
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: Machine
    });
    res.render('reservations', { reservations });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
});

// Trasa do tworzenia nowej rezerwacji
router.post('/', async (req, res) => {
  try {
    const { machineId, date } = req.body;
    const reservation = await Reservation.create({
      machineId,
      date,
      userId: 1 // Zakładam, że mamy statycznego użytkownika na razie
    });
    res.redirect('/reservations');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
});

module.exports = router;
