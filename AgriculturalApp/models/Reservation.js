// models/Reservation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Machine = require('./Machine');

const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    date: { 
        type: DataTypes.DATEONLY, 
        allowNull: false,
        validate: {
            isAfter: new Date().toISOString().split('T')[0],
            isBefore: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        }
    }
});


Reservation.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Reservation.belongsTo(Machine, { foreignKey: 'machine_id', onDelete: 'CASCADE' });

module.exports = Reservation;
