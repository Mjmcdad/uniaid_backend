const { DataTypes } = require('sequelize');
const sequelize = require('../config/dataBase');

const PSection = sequelize.define('PSection', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subjectId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        unique: true
    },
    p_hours: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    time: {
        type: DataTypes.TIME,
        allowNull: true
    }
});

module.exports = PSection;