// routes/machines.js
const express = require('express');
const router = express.Router();
const { Machine } = require('../models');

// Trasa do wyświetlania wszystkich maszyn
router.get('/', async (req, res) => {
  try {
    const machines = await Machine.findAll();
    res.render('machines', { machines });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
});

// Trasa do wyświetlania szczegółów maszyny
router.get('/:id', async (req, res) => {
  try {
    const machine = await Machine.findByPk(req.params.id);
    if (!machine) {
      return res.status(404).send("Maszyna nie została znaleziona");
    }
    res.render('machine', { machine });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
});

module.exports = router;
