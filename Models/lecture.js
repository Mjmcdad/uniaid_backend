const { DataTypes } = require("sequelize");
const sequelize = require("../config/dataBase");

const Lecture = sequelize.define("Lecture", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  subjectId: {
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
    type: DataTypes.ENUM("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"),
    allowNull: false,
  },
  
});

module.exports = Lecture;
