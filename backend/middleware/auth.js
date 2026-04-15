const jwt = require("jsonwebtoken");
const User = require("../models/User");

// protect - Middleware that checks if the incoming request has a valid JWT token.
// It reads the token from the Authorization header, verifies it, and attaches the user to req.user.
// If the token is missing, invalid, or the user no longer exists, it blocks the request with a 401 error.
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check that the Authorization header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token" });
    }

    // Extract the token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Verify the token signature and expiry using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database (exclude the password field)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists" });
    }

    // Attach user to the request so the next handler can access it
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Token invalid or expired" });
  }
};

module.exports = { protect };
