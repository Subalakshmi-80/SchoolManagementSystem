const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {createStandard,getStandards,getOneStandard,updateStandard,deleteStandard} = require("../controllers/standardController")

const router= express.Router();


router.post("/standards",authMiddleware,roleMiddleware("admin"),createStandard);
router.get("/standards",authMiddleware,roleMiddleware("admin"),getStandards);
router.get("/standards/:id",authMiddleware,roleMiddleware("admin"),getOneStandard);
router.put("/standards/:id",authMiddleware,roleMiddleware("admin"),updateStandard);
router.delete("/standards/:id",authMiddleware,roleMiddleware("admin"),deleteStandard);
module.exports = router;