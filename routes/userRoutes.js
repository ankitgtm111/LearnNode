const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authMiddleware");
const validateUser = require("../middleware/validateUser");

router.get("/", userController.getHome);

router.get("/users", authenticateToken, userController.getUsers);

router.get("/users/:id", userController.getUserById);

router.post("/users", validateUser, userController.createUser);

module.exports = router;
