const { DataTypes } = require("sequelize");
const sequelize = require("../../db/dbConnection");
const Hospital = require("../relationalModels/hospitalMaster");
const User = require("../relationalModels/userModel");

const Patient = sequelize.define(
  "patient",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pguardian: {
      type: DataTypes.STRING,
    },
    page: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pgender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pbarcode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    refdoc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    district: {
      type: DataTypes.STRING,
    },
    pop: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    popno: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique:true
    },
    pregdate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    pmobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    whatsappnumber: {
      type: DataTypes.STRING,
    },
    emailid: {
      type: DataTypes.STRING,
    },
    trfno: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique:true
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attatchfile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hospitalid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Hospital,
        key: "id",
      },
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    registration_status: {
      type: DataTypes.ENUM("Center"),
      allowNull: false,
      defaultValue: "Center",
    },
  },
  {
    timestamps: false,
  }
);

/// Relationships
Patient.belongsTo(Hospital, { foreignKey: "hospitalid" });
Hospital.hasMany(Patient, { foreignKey: "hospitalid" });


Patient.belongsTo(User, { foreignKey: "created_by" });
User.hasMany(Patient, { foreignKey: "created_by" });


module.exports = Patient;
