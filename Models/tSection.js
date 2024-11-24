const { DataTypes } = require('sequelize');
const sequelize = require('../config/dataBase');

const TSection = sequelize.define('TSection', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subjectId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    },
    t_hours: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    time: {
        type: DataTypes.DATE,
        allowNull: true
    }
}); 

module.exports = TSection;
