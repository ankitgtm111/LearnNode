const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const validateRequest = require("../middleware/validateRequest");
const studentSchema = require("../validations/studentValidation");

const {
  checkGradeAccess,
  checkSelfAccess,
} = require("../middleware/abacMiddleware");

router.post(
  "/students",
  authenticateToken,
  validateRequest(studentSchema),
  studentController.createStudent,
);

router.get("/students", authenticateToken, studentController.getStudents);

router.get(
  "/students/:id",
  authenticateToken,
  authorizeRoles("admin", "teacher", "student"),
  checkGradeAccess,
  checkSelfAccess,
  studentController.getStudentById,
);

router.put(
  "/students/:id",
  authenticateToken,
  authorizeRoles("admin", "teacher"),
  validateRequest(studentSchema),
  checkGradeAccess,
  studentController.updateStudent,
);

router.delete(
  "/students/:id",
  authenticateToken,
  studentController.deleteStudent,
);

module.exports = router;
