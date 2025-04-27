const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Model tabeli z rezerwacjami
const Reservation = sequelize.define("Reservation", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  date: { type: DataTypes.DATEONLY, allowNull: false },
});

module.exports = Reservation;
