const { DataTypes } = require("sequelize");
const sequelize = require("../config/dataBase");

const PSection = sequelize.define("Rating", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    foreignKey: true,
  },
  rate: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  chat: {
    type: DataTypes.JSON,
  },
  comment: {
    type: DataTypes.STRING,
  },
});

module.exports = PSection;
