const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {createTeacher,getTeacher, getSingleTeacher,updateTeacher,deleteTeacher,importTeachers} = require("../controllers/teacherController");
const multer = require("multer");

const storage = multer.diskStorage({
    destination:"./uploads/",
    filename:(req,file,Callback) =>{
        if(file.mimetype === "text/csv"){
            Callback(null,file.originalname)
        }
        else{
            Callback(new Error("Only CSV files are allowed"))
        }
    }
})

const upload = multer({storage})
const router = express.Router();

router.post("/teacher",authMiddleware,roleMiddleware("admin"),createTeacher);
router.get("/teacher",authMiddleware,roleMiddleware("admin"),getTeacher);
router.get("/teacher/:id",authMiddleware,roleMiddleware("admin"),getSingleTeacher);
router.put("/teacher/:id",authMiddleware,roleMiddleware("admin"),updateTeacher);
router.delete("/teacher/:id",authMiddleware,roleMiddleware("admin"),deleteTeacher);


router.post("/teacher/upload",authMiddleware,roleMiddleware("admin"),upload.single("file"),importTeachers)
module.exports = router;