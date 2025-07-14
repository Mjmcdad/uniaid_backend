const { DataTypes } = require("sequelize");
const sequelize = require("../config/dataBase");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 20],
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 20],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 10],
    },
  },
  role: {
    type: DataTypes.ENUM("admin", "student", "teacher"),
    allowNull: false,
  },
});

module.exports = User;
