const jwt = require("jsonwebtoken");
const User = require("../models/User");

// signToken - Generates a signed JWT token containing the user's ID, used for authenticating future requests
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// register - Creates a new user account after checking for duplicate email, hashes the password via the User model, and returns a JWT token
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check that all required fields are provided
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide name, email and password" });
    }

    // Check if an account with this email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "An account with this email already exists" });
    }

    // Create the user — password is hashed automatically by the User model's pre-save hook
    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    // Extract first validation error message from Mongoose
    if (error.name === "ValidationError") {
      const msg = Object.values(error.errors)[0].message;
      return res.status(400).json({ success: false, message: msg });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// login - Verifies email and password against the database, and returns a JWT token if credentials are correct
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check that both fields are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    // Find user by email and compare the provided password with the stored hash
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// getMe - Returns the currently logged-in user's profile data (requires a valid JWT token via the protect middleware)
const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };
