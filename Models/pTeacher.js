const { DataTypes } = require('sequelize');
const sequelize = require('../config/dataBase');

const PTeacher = sequelize.define('pTeacher', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    teacherId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false
    },
    pSectionId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false
    }
});

module.exports = PTeacher;