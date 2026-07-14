const express = require("express");
const router = express.Router();

const {forgotPassword,verifyOTP,resetPassword, resendOTP} = require("../controllers/forgotPasswordController");


router.post("/forgot-password",forgotPassword);
router.post("/verify-otp",verifyOTP);
router.post("/reset-password",resetPassword);
router.post("/resendOTP",resendOTP)

module.exports = router;