const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/students", authenticateToken, studentController.createStudent);

router.get("/students", authenticateToken, studentController.getStudents);

router.get(
  "/students/:id",
  authenticateToken,
  studentController.getStudentById,
);

router.put("/students/:id", authenticateToken, studentController.updateStudent);

router.delete(
  "/students/:id",
  authenticateToken,
  studentController.deleteStudent,
);

module.exports = router;
