const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { createTest, getTests, getoneTest, updateTest, deleteTest, getStudentByTest, storeMarks, viewMarks, updateMarks } = require('../controllers/testController');

const router = express.Router()


router.post("/tests",authMiddleware,roleMiddleware("teacher"),createTest);
router.get("/tests",authMiddleware,roleMiddleware("teacher"),getTests);
router.get("/tests/:id",authMiddleware,roleMiddleware("teacher"),getoneTest);
router.put("/tests/:id",authMiddleware,roleMiddleware("teacher"),updateTest);
router.delete("/tests/:id",authMiddleware,roleMiddleware("teacher"),deleteTest);

router.get("/tests/:id/students",authMiddleware,roleMiddleware("teacher"),getStudentByTest);
router.post("/tests/:id/marks",authMiddleware,roleMiddleware("teacher"),storeMarks);
router.get("/tests/:id/marks",authMiddleware,roleMiddleware("teacher"),viewMarks);
router.put("/tests/:id/marks",authMiddleware,roleMiddleware("teacher"),updateMarks)

module.exports = router;