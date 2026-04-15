const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const { protect } = require("../middleware/auth");

// All student routes require authentication — the protect middleware
// verifies the JWT and attaches req.user so controllers can scope data by account.
router.use(protect);

// GET /api/students       - Get all students for the logged-in user
router.get("/", getAllStudents);

// GET /api/students/:id   - Get a single student by ID (only if owned by logged-in user)
router.get("/:id", getStudentById);

// POST /api/students      - Create a new student under the logged-in user's account
router.post("/", createStudent);

// PUT /api/students/:id   - Update an existing student (only if owned by logged-in user)
router.put("/:id", updateStudent);

// DELETE /api/students/:id - Delete a student (only if owned by logged-in user)
router.delete("/:id", deleteStudent);

module.exports = router;
