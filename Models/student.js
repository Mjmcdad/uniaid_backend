const { DataTypes } = require('sequelize');
const EnrollmentPrice = require('./enrollmentPrice');
const sequelize = require('../config/dataBase');


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
    enrollmentPriceId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        references: {
            model: EnrollmentPrice,
            key: 'id'
        }
    },
    socialNumber: {
        type: DataTypes.STRING,
        allowNull: true
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
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    major: {
        type: DataTypes.STRING,
        allowNull: true
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
});

module.exports = Student;
