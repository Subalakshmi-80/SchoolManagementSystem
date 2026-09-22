const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {markAttendance} = require('../controllers/attendanceController')

const router = express.Router();

router.post('/attendance',authMiddleware,roleMiddleware("admin","teacher"),markAttendance);

module.exports = router;