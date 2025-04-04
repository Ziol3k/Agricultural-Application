const express = require('express');
const { User, Machine } = require('../models'); // Importujemy modele
const router = express.Router();

// Strona główna dla admina
router.get('/', (req, res) => {
  res.render('admin', { title: 'Panel Administratora' });
});

// Zarządzanie maszynami
router.get('/machines', async (req, res) => {
  try {
    const machines = await Machine.findAll(); // Pobieramy wszystkie maszyny
    res.render('admin/machines', { title: 'Zarządzanie Maszynami', machines });
  } catch (error) {
    console.error(error);
    res.status(500).send('Błąd serwera');
  }
});

// Dodawanie nowej maszyny
router.get('/machines/new', (req, res) => {
  res.render('admin/newMachine', { title: 'Dodaj Nową Maszynę' });
});

router.post('/machines', async (req, res) => {
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
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll(); // Pobieramy wszystkich użytkowników
    res.render('admin/users', { title: 'Zarządzanie Użytkownikami', users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Błąd serwera');
  }
});

// Dodawanie nowego użytkownika
router.get('/users/new', (req, res) => {
  res.render('admin/newUser', { title: 'Dodaj Nowego Użytkownika' });
});

router.post('/users', async (req, res) => {
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
router.post('/users/delete/:id', async (req, res) => {
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
