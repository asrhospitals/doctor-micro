const Router=require('express');
const { login } = require('../controller/authentication/auth');
const router=Router();


// -----------------------------Doctor Authentication Routes--------------------------

// A. Doctors Login
router.route('/login').post(login);

module.exports=router;


