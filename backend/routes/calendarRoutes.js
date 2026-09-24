const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {createHoliday,getHolidays,getHolidayByGroupId,updateHoliday,deleteHoliday, checkCalendarDate} = require('../controllers/calendarController');

const router = express.Router();

router.post('/holiday',authMiddleware,roleMiddleware("admin"),createHoliday);
router.get('/holiday',authMiddleware,roleMiddleware("admin"),getHolidays);
router.get('/holiday/:groupId',authMiddleware,roleMiddleware("admin"),getHolidayByGroupId);
router.put("/holiday/:groupId",authMiddleware,roleMiddleware("admin"),updateHoliday);
router.delete("/holiday/:groupId",authMiddleware,roleMiddleware("admin"),deleteHoliday)

router.get("/date",authMiddleware,roleMiddleware("admin","teacher"),checkCalendarDate)


module.exports = router;
