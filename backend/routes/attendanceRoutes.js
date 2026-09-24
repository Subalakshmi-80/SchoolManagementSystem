const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {markAttendance, getAttendance, updateAttendance, getAttendanceSummary} = require('../controllers/attendanceController')

const router = express.Router();

router.post('/attendance',authMiddleware,roleMiddleware("admin","teacher"),markAttendance);
router.get("/attendance",authMiddleware,roleMiddleware("admin","teacher"),getAttendance);
router.put("/attendance",authMiddleware,roleMiddleware("admin","teacher"),updateAttendance);

router.get("/attendance/summary",authMiddleware,roleMiddleware("admin","teacher"),getAttendanceSummary)
module.exports = router;