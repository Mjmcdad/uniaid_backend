const { DataTypes } = require('sequelize');
const sequelize = require('../dataBase');

const Exam = sequelize.define('Exam', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subjectOfferId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    },
    type: {
        type: DataTypes.ENUM('Final', 'Midterm', 'Practical'),
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Exam;