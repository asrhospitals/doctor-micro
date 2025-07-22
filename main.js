require('dotenv').config({override:true});
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3005;
const cors = require("cors");
const DoctorRoutes=require('./route/doctorRoutes');
const AuthRoutes=require('./route/authRoutes');
const verifyToken=require('./middleware/authMiddileware');
const role=require('./middleware/roleMiddleware');
const sequelize=require('./db/dbConnection');

app.use(cors());
app.use(express.json());


// All Routes Define here

// ------------------Authentication Routes for Doctors
app.use('/lims/doctor/auth',AuthRoutes);


/// ----------------Access of Diffrent Doctor Panel Like biochemistry doctor panel,microbiology doctor panel etc
app.use('/lims/doctor',verifyToken,role('doctor'),DoctorRoutes);


/// For test server 

app.get('/',async (req,res) => {
    return res.json({message:"Yahoooooo! Doctor Microservice  connectd"});
});




const server = async () => {
  try {
    await sequelize.authenticate().then(() => {console.log("Database Connected");}).catch(() => {console.log("Connection Failed");});
    // await sequelize.sync();
    app.listen(PORT, () => {console.log(`Server Connected at the port ${PORT}`);});
  } catch (error) {
    console.log(error);
  }
};


server();