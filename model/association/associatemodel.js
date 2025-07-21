const Patient = require("../relationalModels/patientRegistrationModel");
const Investigation = require("../relationalModels/investigation");
const PatientTest = require("../relationalModels/patientTest");
const Hospital = require("../relationalModels/hospitalMaster");
const ProfileEntryMaster = require("../relationalModels/profileentrymaster");
const Profile = require('../relationalModels/profileMaster');
const Nodal = require("../relationalModels/nodalMaster");
const NodalHospital = require("../relationalModels/attachNodalHospitalMaster");



// Associations

// ✅ Patient ↔ PatientTest
Patient.hasMany(PatientTest, { foreignKey: "patient_id", as: "patientTests" });
PatientTest.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

// ✅ Investigation ↔ PatientTest
Investigation.hasMany(PatientTest, { foreignKey: "investigation_id", as: "investigationTests" });
PatientTest.belongsTo(Investigation, { foreignKey: "investigation_id", as: "investigation" });

// ✅ Hospital ↔ PatientTest
Hospital.hasMany(PatientTest, { foreignKey: "hospitalid", as: "hospitalTests" });
PatientTest.belongsTo(Hospital, { foreignKey: "hospitalid", as: "hospital" });


// ProfileEntryMaster - Investigation many-to-many
Investigation.belongsToMany(ProfileEntryMaster, {
  through: Profile,
  foreignKey: 'investigationid',
  otherKey: 'profileid'
});

ProfileEntryMaster.belongsToMany(Investigation, {
  through: Profile,
  foreignKey: 'profileid',
  otherKey: 'investigationid'
});

// Patient - Investigation many-to-many via PatientTest
Patient.belongsToMany(Investigation, {
  through: PatientTest,
  foreignKey: 'patient_id',
  otherKey: 'id'
});

Investigation.belongsToMany(Patient, {
  through: PatientTest,
  foreignKey: 'id',
  otherKey: 'patient_id'
});


// Nodal - NodalHospital one-to-many
NodalHospital.belongsTo(Nodal, { foreignKey: 'id', as: 'nodal' });
NodalHospital.belongsTo(Hospital, { foreignKey: 'id', as: 'hospital' });

      

module.exports = {
  Patient,
  Investigation,
  PatientTest,
  Hospital,
  ProfileEntryMaster,
  Nodal,
  NodalHospital,
  Profile

};