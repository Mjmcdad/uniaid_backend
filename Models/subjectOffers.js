const { DataTypes } = require('sequelize');
const sequelize = require('../config/dataBase');

const SubjectOffer = sequelize.define('SubjectOffer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subjectId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    },
    semesterId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

module.exports = SubjectOffer;
