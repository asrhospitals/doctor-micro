const {PatientTest,Investigation,Hospital,Patient} = require('../../model/association/associatemodel'); 
const { Op } = require('sequelize');
const {parseISO,isValid}=require('date-fns')




// 1. Get All Tests Send by Technician

const allTestSendByTechnician = async (req, res) => {

    try {

        if(req.user.module?.toLowerCase() !== "microbiology" || req.user.role?.toLowerCase() !== "doctor") {
            return res.status(403).json({ message: "Access denied. Only doctors can access this resource." });
        }

        const micro = await PatientTest.findAll({
            where: {
               status: "doctor",
            },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [
            "id",
            "pname",
            "pregdate",
            "pbarcode",
            "registration_status",
          ],
        },
        {
          model: Investigation,
          as: "investigation",
          attributes: ["id", "testname", "department"],
          where: {
            department: "MICROBIOLOGY", // <- Must match DB spelling
          },
        
        },
        {
          model: Hospital,
          as: "hospital",
          attributes: ["hospitalname"],
        },
        
      
      
      ],
        });

        if (micro.length === 0) {
            return res.status(200).json({ message: "No test are available now" });
        }

        
    //2. Group By Department that is only Microbiology
    // Group by only Microbiology test to a patient
    const groupedByPatient = {};

    micro.forEach((test) => {
      const patientId = test.patient_id;
      const plainTest = test.get({ plain: true }); // Convert Sequelize instance to plain object
      if (!groupedByPatient[patientId]) {
        groupedByPatient[patientId] = {
          patient_id: patientId,
          patient_name: plainTest.patient.pname,
          patient_regdate: plainTest.patient.pregdate,
          patient_barcode: plainTest.patient.pbarcode,
          registration_status: plainTest.patient.registration_status,
          hospital_name: plainTest.hospital.hospitalname,
          tests: [],
        };
      }

      groupedByPatient[patientId].tests.push({
        patient_test_id: plainTest.patient_test_id,
        investigation_id: plainTest.investigation_id,
        testname: plainTest.investigation.testname,
        department: plainTest.investigation.department,
        test_result: plainTest.test_result,
        status: plainTest.status,
        rejection_reason: plainTest.rejection_reason,
        createdAt: plainTest.test_created_date,
        updatedAt: plainTest.test_updated_date,
      });
    });

    // Convert to array
    const groupedResults = Object.values(groupedByPatient);

    return res.status(200).json({
      message: "Test Details of Microbiology been fetched successfully",
      data: groupedResults,
    });
    } catch (error) {
     res.status(500).json({ message: `Internal server error ${error}` });
    }
};


// 2. Update the test result of a patient

const modifyTestResult = async (req, res) => {

  try {

        if(req.user.module?.toLowerCase() !== "microbiology" || req.user.role?.toLowerCase() !== "doctor") {
            return res.status(403).json({ message: "Access denied. Only doctors can access this resource." });
        }


    // Handle multiple test results via request body
    if (req.body.test_results && Array.isArray(req.body.test_results)) {
       const { test_results } = req.body;
      
      if (test_results.length === 0) {
        return res.status(400).json({ message: 'No test results provided' });
      }
      
      let updatedCount = 0;
      for (const item of test_results) {
        const { patient_test_id, test_result, test_image } = item;
        
        // Skip invalid entries
        if (!patient_test_id || !test_result) {
          continue;
        }
        
        // Update the test result
        await PatientTest.update(
          { test_result, test_image, test_updated_date: new Date(), },
          { where: { patient_test_id } }
        );
        
        updatedCount++;
      }
      
      return res.status(200).json({
        message: `Successfully updated ${updatedCount} test result(s)`
      });
      
    } 
    
       // Handle single test result (existing functionality)
    else {

      // const { patient_test_id } = req.params;
      const {patient_test_id,test_result,test_image } = req.body;
     
    // Update the test result and image
     await PatientTest.update(
      {
        test_result,
        test_image,
        test_updated_date: new Date(),
      },
      {
        where: {
        patient_test_id
        },

      }
    );
  
    return res.status(200).json({
      message: "Test result updated successfully",
    });
      
    }
    
  } catch (error) { 
    res.status(500).json({
      message: `Somthing went wrong ${error}`,
    });
  }
};


 
// 3. Update the result status of a patient

const statusToAccept = async (req, res) => {
  try {
    // Collect all the Patient data to send
    const { patient_test_ids } = req.body;
     // Check if the user is from the Microbiology department
        if(req.user.module?.toLowerCase() !== "microbiology" || req.user.role?.toLowerCase() !== "doctor") {
            return res.status(403).json({ message: "Access denied. Only doctors can access this resource." });
        }

    // Update the test result and image
   const [acceptSample]= await PatientTest.update(
      {
        status:"accept"
      },
      {
        where: {
          patient_test_id: patient_test_ids,
          status: "doctor",
          test_result: {
            [Op.ne]: null, // Ensure test_result is not null
          },
        },
      }
    );

    return res.status(200).json({
      message: "Test result accepted successfully",
      data: acceptSample,
    });
  } catch (error) {
    res.status(500).json({
      message:`Something went wrong while accept the test result ${error}`,
    });
  }
} 


// 4. Redo Tests

const redoTest = async (req, res) => {
  try {
    // Collect all the Patient data to send
    const { patient_test_ids } = req.body;
     // Check if the user is from the Microbiology department
        if(req.user.module?.toLowerCase() !== "microbiology" || req.user.role?.toLowerCase() !== "doctor") {
            return res.status(403).json({ message: "Access denied. Only doctors can access this resource." });
        }

    // Update the test result and image
   const [redoSample]= await PatientTest.update(
      {
        status:"redo"
      },
      {
        where: {
          patient_test_id: patient_test_ids,
          status: "doctor",
          test_result: {
            [Op.ne]: null, // Ensure test_result is not null
          },
        },
      }
    );

    return res.status(200).json({
      message: "Test result redo successfully",
      data: redoSample,
    });
  } catch (error) {
    res.status(500).json({
      message:`Something went wrong while redo the test result ${error}`,
    });
  }
}


// 5. Reject Tests
const rejectTest = async (req, res) => {

try {

  // Collect all the Patient data to send
  const { patient_test_ids, rejection_reason } = req.body;
   // Check if the user is from the Microbiology department
  if(req.user.module?.toLowerCase() !== "microbiology" || req.user.role?.toLowerCase() !== "doctor") {
      return res.status(403).json({ message: "Access denied. Only doctors can access this resource." });
  }

  // Update the test result and image
 const [rejectSample]= await PatientTest.update(
    {
      status:"reject",
      rejection_reason: rejection_reason,
    },
    {
      where: {
        patient_test_id: patient_test_ids,
        status: "doctor",
        test_result: {
          [Op.ne]: null, // Ensure test_result is not null
        },
      },
    }
  );

  return res.status(200).json({
    message: "Test result rejected successfully",
    data: rejectSample,
  });
  
} catch (error) {
 res.status(400).json({message:`${error}`});
}
}


// 6. Search Api

const searchAPI = async (req, res) => {
  try {
    /* 1. Authorization */
    const { module, role } = req.user || {};
    if (module?.toLowerCase() !== 'microbiology' || role?.toLowerCase() !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. Only doctors can access this resource.' });
    }

    /* 2. Build dynamic WHERE */
    const { hospital, test, from, to } = req.query;

    // const wherePatientTest = { status: 'doctor' };
    const whereInvestigation = { department: 'MICROBIOLOGY' };
    const whereHospital = {};
    const whereDate = {};

    if (hospital) {
      whereHospital.hospitalname = { [Op.iLike]: `%${hospital}%` };
    }

    if (test) {
      whereInvestigation.testname = { [Op.iLike]: `%${test}%` };
    }

    if (from || to) {
      const start = from ? parseISO(String(from)) : null;
      const end   = to   ? parseISO(String(to))   : null;

      if ((from && !isValid(start)) || (to && !isValid(end))) {
        return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
      }

      whereDate.test_created_date = {
        ...(start && { [Op.gte]: start }),
        ...(end   && { [Op.lte]: end }),
      };
    }

    /* 3. Query */
    const rows = await PatientTest.findAll({
      where: { ...whereDate },
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id', 'pname', 'pregdate', 'pbarcode', 'registration_status'],
        },
        {
          model: Investigation,
          as: 'investigation',
          attributes: ['id', 'testname', 'department'],
          where: whereInvestigation,
        },
        {
          model: Hospital,
          as: 'hospital',
          attributes: ['id', 'hospitalname'],
          where: whereHospital,
        },
      ],
      order: [[{ model: Patient, as: 'patient' }, 'id', 'ASC']],
    });

    if (!rows.length) {
      return res.status(200).json({ message: 'No tests available now.' });
    }

    /* 4. Group by patient */
    const groupedByPatient = rows.reduce((acc, row) => {
      const plain = row.get({ plain: true });
      const pid = plain.patient.id;

      if (!acc[pid]) {
        acc[pid] = {
          patient_id: pid,
          patient_name: plain.patient.pname,
          patient_regdate: plain.patient.pregdate,
          patient_barcode: plain.patient.pbarcode,
          registration_status: plain.patient.registration_status,
          hospital_name: plain.hospital.hospitalname,
          tests: [],
        };
      }

      acc[pid].tests.push({
        patient_test_id: plain.id,
        investigation_id: plain.investigation.id,
        testname: plain.investigation.testname,
        department: plain.investigation.department,
        test_result: plain.test_result,
        status: plain.status,
        rejection_reason: plain.rejection_reason,
        createdAt: plain.createdAt,
        updatedAt: plain.updatedAt,
      });

      return acc;
    }, {});

    return res.status(200).json({
      message: 'Test details of Microbiology fetched successfully.',
      data: Object.values(groupedByPatient),
    });
  } catch (err) {
    res.status(500).json({ message: `Internal server error ${err}` });
  }
};




module.exports = {allTestSendByTechnician,modifyTestResult,statusToAccept,redoTest, rejectTest,searchAPI};