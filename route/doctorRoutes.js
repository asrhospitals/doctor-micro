const Router= require('express');
const { getAllTestsSendByTechnician, updateTestResult, updateStatusToAccept, redoTests, rejectTests, searchApi } = require('../controller/bioChemistryDoctor/bioDoctor');
const { allTestSendByTechnician, modifyTestResult, statusToAccept, redoTest, rejectTest, searchAPI } = require('../controller/microBiologyDoctor/mircoDoctor');
const router= Router();



// ----------------------------------Manage Biochemistry Doctor Routes-------------------------------

// 1. Get All Tests Send by Technician
router.route('/get-biochem-tests').get(getAllTestsSendByTechnician);
// 2. Update Test Results
router.route('/update-biochem-result').put(updateTestResult);
// 3. Accept Test Result
router.route('/accept-biochem-result').put(updateStatusToAccept);
// 4. Redo Tests
router.route('/redo-biochem-tests').put(redoTests);
// 5. Rejected Tests
router.route('/reject-biochem-tests').put(rejectTests);
// 6. Search Api
router.route('/biochem/secrch').get(searchApi);

// --------------------------------Manage MicroBiology Doctor Routes-----------------------------------

// 7. Get All Tests Send by Technician
router.route('/get-micro-tests').get(allTestSendByTechnician);
// 8. Update Test Results
router.route('/update-micro-result').put(modifyTestResult);
// 9. Accept Test Result
router.route('/accept-micro-result').put(statusToAccept);
// 10. Redo Tests
router.route('/redo-micro-tests').put(redoTest);
// 11. Rejected Tests
router.route('/reject-micro-tests').put(rejectTest);
// 12. Search Api
router.route('/micro/secrch').get(searchAPI);




module.exports=router;