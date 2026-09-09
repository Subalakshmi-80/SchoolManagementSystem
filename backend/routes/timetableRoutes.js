const express = require('express');

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware")
const { getPeriods, createTimetable, getTimetableByClass, updateTimetable} = require('../controllers/timetableController');

const router = express.Router();

router.get('/periods',authMiddleware,roleMiddleware("admin"),getPeriods);

router.post('/timetable',authMiddleware,roleMiddleware("admin"),createTimetable);

router.get('/timetable/class/:id',authMiddleware,roleMiddleware("admin"),getTimetableByClass);

router.put("/timetable",authMiddleware,roleMiddleware("admin"),updateTimetable)

module.exports = router;