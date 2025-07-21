require('dotenv').config();
const {Sequelize}=require('sequelize');


/// For Dev
// const sequelize = new Sequelize('lims_database', 'postgres', 'Postgres123', {
//    host: 'localhost',
//    dialect: 'postgres',
//    port: 5432,
//  });




///For Production
const sequelize=new Sequelize(process.env.DATABASE_URL,{
    dialect:'postgres'
});


module.exports=sequelize;