const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {createClass,getClass,getSingleClass,updateClass,deleteClass} = require('../controllers/classesController')

const router = express.Router();

router.post("/classes",authMiddleware,roleMiddleware("admin"),createClass);
router.get("/classes",authMiddleware,roleMiddleware("admin","teacher"),getClass);
router.get("/classes/:id",authMiddleware,roleMiddleware("admin"),getSingleClass);
router.put("/classes/:id",authMiddleware,roleMiddleware("admin"),updateClass);
router.delete("/classes/:id",authMiddleware,roleMiddleware("admin"),deleteClass)


module.exports = router;