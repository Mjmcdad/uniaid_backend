const { DataTypes } = require('sequelize');
const sequelize = require('../dataBase');

const Student = sequelize.define('Student', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
     userId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    },
    socialNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hoursAchieved: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    gpa: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    academicYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    enrollmentDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    major: {
        type: DataTypes.STRING,
        allowNull: true
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

module.exports = Student;
