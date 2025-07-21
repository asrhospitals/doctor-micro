const { DataTypes } = require("sequelize");
const sequelize = require("../../db/dbConnection");
const Investigation = require("../relationalModels/investigation");
const ProfileEntry = require("../relationalModels/profileentrymaster");


const Profile = sequelize.define("profilemaster",{
    profileid: {
      type: DataTypes.INTEGER,
      references: {
        model: ProfileEntry,
        key: "id",
      },
    },
    investigationid: {
      type: DataTypes.INTEGER,
      references: {
        model: Investigation,
        key: "id",
      },
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Profile;
