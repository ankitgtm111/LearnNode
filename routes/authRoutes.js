const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.get("/signup", authController.getLoginPage);
router.post("/login", authController.loginUser);

module.exports = router;
