const express = require("express");
const { registerUser,loginUser,getProfile,updatePassword,forgotPassword,resetPassword} = require("../controllers/user_auth");
const { protect } = require("../middlewares/auth_middlewares");
const { authLimiter } = require("../middlewares/rate_limit_middlewares");

const router = express.Router();

// REGISTER
router.post("/register",authLimiter, registerUser);
router.post("/login",authLimiter,loginUser)
router.get("/checkAuth", protect, getProfile);
router.put("/updatePassword", protect, updatePassword);
router.post("/forgotPassword",authLimiter,forgotPassword);
router.put("/resetPassword/:token", resetPassword);


module.exports = router;
