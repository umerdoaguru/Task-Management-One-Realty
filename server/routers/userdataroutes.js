const express = require("express");

const { user_data, register, login, getuserdata, sendOtpSuperAdmin, verifyOtpSuperAdmin, resetPasswordSuperAdmin, deleteContatct } = require("../controllers/UserController");
const authenticate = require("../Middleware/authMiddleware");
const router = express.Router();






router.post("/register",register);
router.post("/login",login );
router.post("/contact",user_data);
router.get("/user-data",authenticate, getuserdata);
router.delete("/user-data/:id", deleteContatct);

router.post("/sendOtp-superadmin", sendOtpSuperAdmin);
router.post("/verifyOtp-superadmin", verifyOtpSuperAdmin);
router.put("/resetPassword-superadmin",resetPasswordSuperAdmin);


module.exports = router;