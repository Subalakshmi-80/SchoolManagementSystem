const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {createStudent,getStudents ,getOneStd,updateStd,deleteStd}= require("../controllers/studentController");
const router = express.Router();


router.post("/students",authMiddleware,roleMiddleware("admin"),createStudent);
router.get("/students",authMiddleware,roleMiddleware("admin"),getStudents);
router.get("/students/:id",authMiddleware,roleMiddleware("admin"),getOneStd);
router.put("/students/:id",authMiddleware,roleMiddleware("admin"),updateStd);
router.delete("/students/:id",authMiddleware,roleMiddleware("admin"),deleteStd);



module.exports = router;