const express = require('express');
const { User, Machine, Reservation } = require('../models');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { isAdmin } = require('../middleware/authMiddleware');


// Strona główna panelu administratora
router.get('/', isAdmin, async (req, res) => {
  try {
    const users = await User.findAll();
    const reservations = await Reservation.findAll();
    const machines = await Machine.findAll();

    res.render('admin/index', {
      title: 'Panel Administratora',
      users,
      reservations,
      machines,
      user: req.user  // przekazanie aktualnie zalogowanego użytkownika
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd serwera');
  }
});

// Zarządzanie maszynami
router.get('/machines', isAdmin, async (req, res) => {  
  try {
    const machines = await Machine.findAll(); 
    res.render('admin/machines', { title: 'Zarządzanie Maszynami', machines });
  } catch (error) {
    console.error(error);
    res.status(500).send('Błąd serwera');
  }
});

// Dodawanie nowej maszyny
router.post('/machines', isAdmin, async (req, res) => { 
  const { name, description, image_url } = req.body;
  try {
    await Machine.create({ name, description, image_url });
    res.redirect('/admin/machines');
  } catch (error) {
    console.error(error);
    res.status(500).send('Błąd podczas dodawania maszyny');
  }
});

// Zarządzanie użytkownikami
router.get('/users', isAdmin, async (req, res) => {  
  try {
    const users = await User.findAll(); 
    res.render('admin/users', { title: 'Zarządzanie Użytkownikami', users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Błąd serwera');
  }
});

// Dodawanie nowego użytkownika
router.post('/users', isAdmin, async (req, res) => {  
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword, role });
    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Błąd podczas dodawania użytkownika');
  }
});

// Usuwanie użytkownika
router.post('/users/delete/:id', isAdmin, async (req, res) => { 
  try {
    const userId = req.params.id;
    await User.destroy({ where: { id: userId } });
    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Błąd podczas usuwania użytkownika');
  }
});

module.exports = router;
