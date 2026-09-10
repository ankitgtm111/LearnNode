const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { loginLimiter } = require("../middleware/rateLimiters");

router.get("/signup", authController.getLoginPage);
router.post("/register", authController.registerUser);
router.post("/login", loginLimiter, authController.loginUser);

module.exports = router;
