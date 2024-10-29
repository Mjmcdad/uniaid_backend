const { DataTypes } = require('sequelize');
const sequelize = require('../dataBase');

const MarkSplit = sequelize.define('MarkSplit', {
    id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subjectOfferId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    },
    finalMark: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    midtermMark: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    practicalMark: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    assignmentMark: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});     

module.exports = MarkSplit;
