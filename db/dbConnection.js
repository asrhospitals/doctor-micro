require("dotenv").config();
const { Sequelize } = require("sequelize");

/// For Dev
// const sequelize = new Sequelize('lims_database', 'postgres', 'Postgres123', {
//    host: 'localhost',
//    dialect: 'postgres',
//    port: 5432,
//  });

///For Production
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL environment variable is not set!");
  console.log("Available environment variables:", Object.keys(process.env).filter(key => key.includes('DB') || key.includes('DATABASE')));
  process.exit(1);
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  port: 5432,
});

module.exports = sequelize;