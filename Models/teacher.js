const { DataTypes } = require('sequelize');
const sequelize = require('../dataBase');

const Teacher = sequelize.define('Teacher', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    }
});

module.exports = Teacher;