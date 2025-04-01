const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Machine = require('./Machine');

const Reservation = sequelize.define('Reservation', {
    date: { type: DataTypes.DATEONLY, allowNull: false }
});

Reservation.belongsTo(User);
Reservation.belongsTo(Machine);

module.exports = Reservation;
