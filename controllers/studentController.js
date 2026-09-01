const Student = require("../models/studentModel");

async function createStudent(req, res) {
  try {
    const student = await Student.create(req.body);

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

async function getStudentById(req, res) {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        error: "Student not found",
      });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({
      error: "Invalid student ID",
    });
  }
}

async function updateStudent(req, res) {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({
        error: "Student not found",
      });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

async function deleteStudent(req, res) {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        error: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student deleted successfully",
      student,
    });
  } catch (error) {
    res.status(400).json({
      error: "Invalid student ID",
    });
  }
}

async function getStudents(req, res) {
  try {
    const { grade, isActive } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filter = {};

    if (grade) {
      filter.grade = grade;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const skip = (page - 1) * limit;

    const students = await Student.find(filter).skip(skip).limit(limit);

    const totalStudents = await Student.countDocuments(filter);
    const totalPages = Math.ceil(totalStudents / limit);

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalStudents,
      students,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch students",
    });
  }
}

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
