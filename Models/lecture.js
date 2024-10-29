const { DataTypes } = require('sequelize');
const sequelize = require('../dataBase');

const Lecture = sequelize.define('Lecture', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subjectOfferId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    }, 
    roomId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    }
});

module.exports = Lecture;