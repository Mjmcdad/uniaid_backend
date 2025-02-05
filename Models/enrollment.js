const { DataTypes } = require('sequelize');
const sequelize = require('../config/dataBase');

const Enrollment = sequelize.define('Enrollment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    studentId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    },
    subjectOfferId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    },  
    isQualified: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Enrolled','Failed', 'Passed'),
        allowNull: false
    }
});



module.exports = Enrollment;
