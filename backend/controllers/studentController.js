const Student = require("../models/Student");

// getAllStudents - Fetches only the student records belonging to the logged-in user, sorted by newest first
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// getStudentById - Fetches a single student record, ensuring it belongs to the logged-in user
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id, userId: req.user._id });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// createStudent - Creates a new student record tied to the logged-in user's account
const createStudent = async (req, res) => {
  try {
    const student = await Student.create({ ...req.body, userId: req.user._id });
    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    // Handle duplicate email or roll number (MongoDB error code 11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `A student with this ${field} already exists`,
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// updateStudent - Updates a student, but only if that student belongs to the logged-in user
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      {
        new: true,           // return the updated document
        runValidators: true, // re-run schema validators on update
      }
    );
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// deleteStudent - Deletes a student, but only if that student belongs to the logged-in user
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
