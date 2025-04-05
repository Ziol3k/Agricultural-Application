const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Machine = sequelize.define('Machine', {
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
        allowNull: true,  
        // validate: {
        //     isUrl: {
        //         args: false,
        //         msg: 'Image URL must be a valid URL or relative path'
        //     }
        // }
    }
});

module.exports = Machine;
