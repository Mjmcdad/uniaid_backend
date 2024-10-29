const { DataTypes } = require('sequelize');
const sequelize = require('../dataBase');

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
        allowNull: false
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false
    }
}); 

module.exports = TSection;
