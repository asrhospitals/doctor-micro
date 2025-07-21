const { DataTypes} = require("sequelize");
const sequelize = require("../../db/dbConnection");


const Investigation = sequelize.define("investigation", {

  /// Test Info
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  department: {
    type: DataTypes.STRING,
  },
  subdepartment: {
    type: DataTypes.STRING,
  },
  testname: {
    type: DataTypes.STRING,
    allowNull:false
  },
  aliasname: {
    type: DataTypes.STRING,
    allowNull:true
  },
  testcode:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  shortcode:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  roletype:{
    type:DataTypes.STRING,
    allowNull:false
  },
  sequesncecode:{
    type:DataTypes.STRING,
    allowNull:false
  },

/// Report Info
  reporttype:{
    type:DataTypes.STRING,
    allowNull:false
  },
  mesuringunit:{
    type:DataTypes.STRING
  },
  refrange:{
    type:DataTypes.STRING,
    allowNull:false
  },

  ///More Test Details

  tat:{
    type:DataTypes.STRING,
    allowNull:false
  },

  techtat:{
    type:DataTypes.STRING,
    allowNull:false
  },
  dieases:{
    type:DataTypes.STRING
  },
  testdone:{
    type:DataTypes.STRING
  },
  specimentyepe:{
    type:DataTypes.STRING,
    allowNull:false
  },
  volume:{
    type:DataTypes.STRING
  },
  tubecolor:{
    type:DataTypes.STRING
  },
  hospitaltype:{
    type:DataTypes.ARRAY(DataTypes.STRING),
    allowNull:false  
  },
  testcategory:{
    type:DataTypes.STRING
  },
  processingcenter:{
    type:DataTypes.STRING,
    allowNull:false
  },
  testcollectioncenter:{
    type:DataTypes.STRING,
    allowNull:false
  },
  samplecollection:{
    type:DataTypes.STRING
  },
  reportprint:{
    type:DataTypes.STRING
  },
  resultentryby:{
    type:DataTypes.STRING
  },
  allowselecttestcode:{
    type:DataTypes.BOOLEAN,
    defaultValue:true
  },
  reportattachment:{
    type:DataTypes.BOOLEAN,
    defaultValue:false,
  },
  printinreport:{
    type:DataTypes.BOOLEAN,
    defaultValue:true
  },
  uploadimage:{
    type:DataTypes.BOOLEAN,
    defaultValue:true
  },
  isactive:{
    type:DataTypes.BOOLEAN,
    defaultValue:true
  },
  addbarcode:{
    type:DataTypes.BOOLEAN,
    defaultValue:false

  },
  accredationname: {
    type: DataTypes.STRING,
  },
  accredationdate: {
    type: DataTypes.DATE,
  },
});







module.exports=Investigation;
