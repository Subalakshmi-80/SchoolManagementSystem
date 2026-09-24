const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const {createAcademicYear,
        getAcademicYears,
        getOneAcademicYear,
        updateAcademicYear,
        deleteAcademicYear} = require('../controllers/academicYearController');

const router = express.Router();

router.post('/academicyears',authMiddleware,roleMiddleware("admin"),createAcademicYear);
router.get('/academicyears',authMiddleware,roleMiddleware("admin","teacher"),getAcademicYears);
router.get('/academicyears/:id',authMiddleware,roleMiddleware("admin"),getOneAcademicYear);
router.put('/academicyears/:id',authMiddleware,roleMiddleware("admin"),updateAcademicYear);
router.delete('/academicyears/:id',authMiddleware,roleMiddleware("admin"),deleteAcademicYear);

module.exports = router;