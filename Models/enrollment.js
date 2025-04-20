const { DataTypes } = require('sequelize');
const sequelize = require('../config/dataBase');
const SubjectOffer = require("./subjectOffers")
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
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Enrolled', 'Failed', 'Passed'),
        allowNull: false
    }
});


Enrollment.belongsTo(SubjectOffer, { foreignKey: 'subjectOfferId', onDelete: 'CASCADE' });
module.exports = Enrollment;
