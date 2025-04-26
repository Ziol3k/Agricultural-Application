// models/index.js
const sequelize = require('../config/database');
const User = require('./User');
const Machine = require('./Machine');
const Reservation = require('./Reservation');

// Relacje
Reservation.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Reservation.belongsTo(Machine, { foreignKey: 'machine_id', onDelete: 'CASCADE' });

User.hasMany(Reservation, { foreignKey: 'user_id' });
Machine.hasMany(Reservation, { foreignKey: 'machine_id' });


module.exports = {
  sequelize,
  User,
  Machine,
  Reservation
};
