const express = require('express');

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {createSubject, getSubjects, getOneSubject, updateSubject, deleteSubject} = require("../controllers/subjectController")

const router = express.Router()

router.post("/subjects",authMiddleware,roleMiddleware("admin"),createSubject);
router.get("/subjects",authMiddleware,roleMiddleware("admin","teacher"),getSubjects);
router.get("/subjects/:id",authMiddleware,roleMiddleware("admin"),getOneSubject);
router.put("/subjects/:id",authMiddleware,roleMiddleware("admin"),updateSubject);
router.delete("/subjects/:id",authMiddleware,roleMiddleware("admin"),deleteSubject)
module.exports = router;