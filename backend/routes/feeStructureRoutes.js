const express = require('express');

const router= express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require("../middleware/roleMiddleware");

const {createFeeStructure,
    getFeeStructures,
    getOneFeeStructure,
    updateFeeStructure,
    deleteFeeStructure} = require("../controllers/feesStructureController");

router.post("/feestructures",authMiddleware,roleMiddleware("admin"),createFeeStructure);
router.get("/feestructures",authMiddleware,roleMiddleware("admin"),getFeeStructures);
router.get("/feestructures/:id",authMiddleware,roleMiddleware("admin"),getOneFeeStructure);
router.put("/feestructures/:id",authMiddleware,roleMiddleware("admin"),updateFeeStructure);
router.delete("/feestructures/:id",authMiddleware,roleMiddleware("admin"),deleteFeeStructure);

module.exports = router;
