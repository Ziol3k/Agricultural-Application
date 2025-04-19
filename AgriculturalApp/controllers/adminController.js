const { User, Machine, Reservation } = require('../models');
const bcrypt = require('bcryptjs');

exports.getAdminDashboard = async (req, res) => {
  try {
    const users = await User.findAll();
    const reservations = await Reservation.findAll();
    const machines = await Machine.findAll();

    res.render('admin/index', {
      title: 'Panel Administratora',
      users,
      reservations,
      machines,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd serwera');
  }
};

exports.getMachines = async (req, res) => {
  try {
    const machines = await Machine.findAll();
    res.render('admin/machines', { title: 'Zarządzanie Maszynami', machines });
  } catch (error) {
    console.error(error);
    res.status(500).send('Błąd serwera');
  }
};

exports.addMachine = async (req, res) => {
  const { name, description } = req.body;
  const image_url = req.file ? '/images/machines/' + req.file.filename : null;

  try {
    await Machine.create({ name, description, image_url });
    res.redirect('/admin/machines');
  } catch (error) {
    console.error(error);
    res.status(500).send('Błąd podczas dodawania maszyny');
  }
};

// exports.deleteMachine = async (req, res) => {
//     try {
//       const machineId = req.params.id;
//       await Machine.destroy({ where: { id: machineId } });
//       res.redirect('/admin/machines');
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Błąd podczas usuwania maszyny');
//     }
//   };

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('admin/users', { title: 'Zarządzanie Użytkownikami', users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Błąd serwera');
  }
};

exports.addUser = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword, role });
    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Błąd podczas dodawania użytkownika');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.destroy({ where: { id: userId } });
    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Błąd podczas usuwania użytkownika');
  }
};
