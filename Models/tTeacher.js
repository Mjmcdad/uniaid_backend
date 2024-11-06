const { DataTypes } = require('sequelize');
const sequelize = require('../config/dataBase');

const TTeacher = sequelize.define('tTeacher', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    teacherId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    },
    tSectionId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    }
});

module.exports = TTeacher;