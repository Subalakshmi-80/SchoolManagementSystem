const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {createStudent,getStudents ,getOneStd,updateStd,deleteStd, importStudents}= require("../controllers/studentController");
const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
    destination:"./uploads/",
    filename:(req,file,callback)=>{

        if(file.mimetype==="text/csv"){
             callback(null,file.originalname)
        }
        else{
            callback(new Error("Only CSV files are allowed"))
        }
       
    }
})

const upload = multer({storage});

router.post("/students",authMiddleware,roleMiddleware("admin"),createStudent);
router.get("/students",authMiddleware,roleMiddleware("admin"),getStudents);
router.get("/students/:id",authMiddleware,roleMiddleware("admin"),getOneStd);
router.put("/students/:id",authMiddleware,roleMiddleware("admin"),updateStd);
router.delete("/students/:id",authMiddleware,roleMiddleware("admin"),deleteStd);

// create students through csv file

router.post("/students/upload",authMiddleware,roleMiddleware("admin"),upload.single("file"),importStudents)

module.exports = router;