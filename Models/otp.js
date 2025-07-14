const { DataTypes } = require("sequelize");
const sequelize = require("../config/dataBase");

const OTP = sequelize.define(
  "otp",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    indexes: [
      {
        fields: ["email"],
      },
      {
        fields: ["expiresAt"],
      },
    ],
  }
);

OTP.prototype.isExpired = function () {
  return this.expiresAt < new Date();
};

module.exports = OTP;
