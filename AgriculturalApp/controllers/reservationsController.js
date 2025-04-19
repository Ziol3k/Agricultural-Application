const { Reservation, Machine } = require('../models'); 

const showReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: Machine
    });
    res.render('reservations', { reservations });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
};

const createReservation = async (req, res) => {
  try {
    const { machineId, date } = req.body;
    await Reservation.create({
      machineId,
      date,
      userId: 1 
    });
    res.redirect('/reservations');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
};

module.exports = {
  showReservations,
  createReservation
};
