const { Reservation, Machine } = require('../models'); // Importujemy modele

// Strona główna dla użytkownika
const userDashboard = (req, res) => {
  res.render('user', { title: 'Panel Użytkownika' });
};

// Wyświetlanie rezerwacji użytkownika
const showUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { userId: req.user.id },
      include: Machine
    });
    res.render('user/reservations', { title: 'Twoje Rezerwacje', reservations });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd serwera');
  }
};

// Dodawanie rezerwacji
const createUserReservation = async (req, res) => {
  try {
    const { machineId, date } = req.body;
    await Reservation.create({
      machineId,
      userId: req.user.id,
      date
    });
    res.redirect('/user/reservations');
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd serwera');
  }
};

// Usuwanie rezerwacji
const deleteUserReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    await Reservation.destroy({ where: { id: reservationId } });
    res.redirect('/user/reservations');
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd serwera');
  }
};

module.exports = {
  userDashboard,
  showUserReservations,
  createUserReservation,
  deleteUserReservation
};
