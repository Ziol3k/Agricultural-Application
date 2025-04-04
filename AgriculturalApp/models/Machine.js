const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Machine = sequelize.define('Machine', {
    name: { 
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.TEXT 
    },
    image_url: { 
        type: DataTypes.STRING,
        allowNull: true,  // Możliwość braku obrazu
        validate: {
            isUrl: true, // Sprawdzenie, czy to poprawny URL
        }
    }
});

module.exports = Machine;
