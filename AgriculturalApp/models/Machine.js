// models/Machine.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Machine = sequelize.define('Machine', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: { 
        type: DataTypes.STRING, 
        //unique: true, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.TEXT 
    },
    image_url: { 
        type: DataTypes.STRING,
        allowNull: true
    }
});


module.exports = Machine;
