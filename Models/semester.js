const { DataTypes } = require('sequelize');
const sequelize = require('../dataBase');

const Semester = sequelize.define('Semester', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    term: {
        type: DataTypes.ENUM('Winter','Summer', 'Fall'),
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

module.exports = Semester;