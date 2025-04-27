const { Sequelize } = require("sequelize");

// Połączenie z bazą SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: false,
});

module.exports = sequelize;
