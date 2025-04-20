const { DataTypes } = require('sequelize');
const sequelize = require('../config/dataBase');

const Subject = sequelize.define('Subject', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    prerequisites: {
        type: DataTypes.STRING,
        allowNull: true
    },
    requiredFor: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subjectType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    hours: {
        type: DataTypes.INTEGER,
        allowNull: false
    },  
    academicYear: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    hasPractical: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

module.exports = Subject;
