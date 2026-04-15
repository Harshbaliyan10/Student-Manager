const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// POST /api/auth/register - Register a new user account
router.post("/register", register);

// POST /api/auth/login    - Login with email and password, returns a JWT token
router.post("/login", login);

// GET  /api/auth/me       - Get the currently logged-in user's profile (requires valid JWT token)
router.get("/me", protect, getMe);

module.exports = router;
