require("dotenv").config();

const mongoose = require("mongoose");
const Course = require("./models/courseModel");
const Student = require("./models/studentModel");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

async function seedDatabase() {
  try {
    const courses = await Course.insertMany([
      {
        title: "Mathematics",
        credits: 4,
      },
      {
        title: "Computer Science",
        credits: 5,
      },
      {
        title: "Physics",
        credits: 4,
      },
    ]);

    await Student.insertMany([
      {
        name: "Alice",
        enrolledCourses: [courses[0]._id, courses[1]._id],
      },
      {
        name: "Bob",
        enrolledCourses: [courses[1]._id, courses[2]._id],
      },
    ]);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Database seeding failed:", error.message);
  }
}

function getStudentProfile(studentId) {
  let studentData;

  Student.findById(studentId)
    .then((student) => {
      if (!student) {
        throw new Error("Student not found");
      }

      studentData = student;

      return Course.find({
        _id: { $in: student.enrolledCourses },
      });
    })
    .then((courses) => {
      const profile = {
        name: studentData.name,
        courses: courses,
      };

      console.log("Student profile:");
      console.log(profile);
    })
    .catch((error) => {
      console.error("Error fetching student profile:", error.message);
    });
}

function getMultipleCourses(courseIds) {
  const coursePromises = courseIds.map((id) => {
    return Course.findById(id);
  });

  Promise.all(coursePromises)
    .then((courses) => {
      console.log("Multiple courses:");
      console.log(courses);
    })
    .catch((error) => {
      console.error("Error fetching courses:", error.message);
    });
}

connectDB().then(async () => {
  // seedDatabase();

  const courses = await Course.find({
    title: { $in: ["Mathematics", "Computer Science", "Physics"] },
  });

  const courseIds = courses.map((course) => course._id);

  getMultipleCourses(courseIds);
});
