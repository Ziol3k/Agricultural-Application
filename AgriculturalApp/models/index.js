const sequelize = require('../config/database');
const User = require('./User');
const Machine = require('./Machine');
const Reservation = require('./Reservation');

// Relacje
Reservation.belongsTo(User);
Reservation.belongsTo(Machine);
User.hasMany(Reservation);
Machine.hasMany(Reservation);

module.exports = {
  sequelize,
  User,
  Machine,
  Reservation
};
