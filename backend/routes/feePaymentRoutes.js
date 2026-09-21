const express = require('express');

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {createFeePayment,getStudentFees,getFeeDashboard,getClassStudentsFees} = require('../controllers/feePaymentController');

const router = express.Router();

router.post('/feepayments',authMiddleware,roleMiddleware("admin"),createFeePayment);
router.get('/students/:studentId/fees/:academicYearId',authMiddleware,roleMiddleware('admin'),getStudentFees);
router.get("/feesdashboard",authMiddleware,roleMiddleware("admin"),getFeeDashboard);

router.get('/fees/class/:classId/students',authMiddleware,roleMiddleware('admin'),getClassStudentsFees);
module.exports = router;