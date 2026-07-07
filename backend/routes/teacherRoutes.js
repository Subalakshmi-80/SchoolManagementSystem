const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {createTeacher,getTeacher, getSingleTeacher,updateTeacher,deleteTeacher} = require("../controllers/teacherController");

const router = express.Router();

router.post("/teacher",authMiddleware,roleMiddleware("admin"),createTeacher);
router.get("/teacher",authMiddleware,roleMiddleware("admin"),getTeacher);
router.get("/teacher/:id",authMiddleware,roleMiddleware("admin"),getSingleTeacher);
router.put("/teacher/:id",authMiddleware,roleMiddleware("admin"),updateTeacher);
router.delete("/teacher/:id",authMiddleware,roleMiddleware("admin"),deleteTeacher);



module.exports = router;