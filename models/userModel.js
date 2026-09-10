const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "teacher", "student"],
    default: "student",
  },

  assignedGrade: {
    type: String,
    default: null,
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
