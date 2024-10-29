const { DataTypes } = require('sequelize');
const sequelize = require('../dataBase');

const PTeacher = sequelize.define('pTeacher', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    teacherId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    },
    pSectionId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    }
});

module.exports = PTeacher;