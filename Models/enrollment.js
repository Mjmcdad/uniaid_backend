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
        allowNull: false
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
        type: DataTypes.ENUM('Enrolled', 'Failed', 'Passed', 'OnHold'),
        allowNull: false
    },
    group: {
        type: DataTypes.INTEGER,
    }
});


Enrollment.belongsTo(SubjectOffer, { foreignKey: 'subjectOfferId', onDelete: 'CASCADE' });
module.exports = Enrollment;
