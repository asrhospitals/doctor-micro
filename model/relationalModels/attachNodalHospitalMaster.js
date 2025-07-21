const { DataTypes } = require('sequelize');
const sequialize = require('../../db/dbConnection');
const Nodal = require('../relationalModels/nodalMaster');
const Hospital = require('../relationalModels/hospitalMaster');


const NodalHospital=sequialize.define('nodalhospital',{
    
    nodalid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, 
        references: {
            model: Nodal,
            key: 'id',
        },
    },
    hospitalid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, 
        references: {
            model: Hospital,
            key: 'id',
        },
    },
    isactive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, { timestamps: false });


module.exports=NodalHospital;


