const { DataTypes } = require('sequelize');
const sequelize = require('../dataBase');

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    }
});

module.exports = Admin;