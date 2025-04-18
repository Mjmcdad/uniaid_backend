const { DataTypes } = require("sequelize");
const sequelize = require("../config/dataBase");

const Lecture = sequelize.define("Lecture", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  subjectOfferId: {
    type: DataTypes.INTEGER,
    foreignKey: true,
  },
  roomId: {
    type: DataTypes.INTEGER,
    foreignKey: true,
  },
  start_time: {
    type: DataTypes.STRING,
  },
  end_time: {
    type: DataTypes.STRING,
  },
  day: {
    type: DataTypes.STRING,
  }
});

module.exports = Lecture;
