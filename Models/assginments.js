const { DataTypes } = require('sequelize');
const sequelize = require('../config/dataBase');

const Assignment = sequelize.define('Assignment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    markSplitId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    },
    assignmentName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    assignmentNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    assignmentMark: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
});

module.exports = Assignment;
