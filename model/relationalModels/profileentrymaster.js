const { DataTypes } = require("sequelize");
const sequalize = require("../../db/dbConnection");


const ProfileEntryMaster = sequalize.define(
  "profileentrymaster",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    profilename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilecode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alternativebarcode: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);



module.exports = ProfileEntryMaster;
