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
        allowNull: false
    },
    tSectionId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false

    }
});

module.exports = TTeacher;