const { DataTypes } = require('sequelize');
const sequelize = require('../config/dataBase');

const EnrollmentPrice = sequelize.define('enrollmentPrice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = EnrollmentPrice;