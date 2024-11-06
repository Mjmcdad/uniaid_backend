const { DataTypes } = require('sequelize');
const sequelize = require('../config/dataBase');

const Subject = sequelize.define('Subject', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hours: {
        type: DataTypes.INTEGER,
        allowNull: false
    },  
    academicYear: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hasPractical: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

module.exports = Subject;
