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
    prerequisitesId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Subjects',
            key: 'id'
        }
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
}, {
    tableName: 'Subjects',
    timestamps: true
});


Subject.hasMany(Subject, { as: "required_for", foreignKey: 'prerequisitesId', onDelete: "CASCADE" });
Subject.belongsTo(Subject, { as: "prerequisites", foreignKey: 'prerequisitesId', onDelete: "CASCADE" });

module.exports = Subject;