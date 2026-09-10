const Student = require("../models/studentModel");

async function checkGradeAccess(req, res, next) {
  try {
    // Admins bypass grade-based restrictions
    if (req.user.role === "admin") {
      return next();
    }

    // Teachers may only manage students in their assigned grade
    if (req.user.role === "teacher") {
      const student = await Student.findById(req.params.id);

      if (!student) {
        return res.status(404).json({
          error: "Student not found",
        });
      }

      if (req.user.assignedGrade !== student.grade) {
        return res.status(403).json({
          error:
            "ABAC Denied: You are only authorized to manage students in your assigned grade.",
        });
      }

      return next();
    }

    // Other roles continue to the next ABAC rule
    next();
  } catch (error) {
    res.status(400).json({
      error: "Invalid student ID",
    });
  }
}

function checkSelfAccess(req, res, next) {
  // Only students need the self-access restriction
  if (req.user.role === "student") {
    if (
      !req.user.studentId ||
      req.params.id !== req.user.studentId.toString()
    ) {
      return res.status(403).json({
        error: "ABAC Denied: Students can only access their own record.",
      });
    }
  }

  next();
}

module.exports = {
  checkGradeAccess,
  checkSelfAccess,
};
