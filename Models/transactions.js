const { DataTypes } = require('sequelize');
const sequelize = require('../config/dataBase');

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    studentId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    },
    subjectId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    },
    amount: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    transactionDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

module.exports = Transaction;
