const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema - Defines the structure for user accounts stored in the "users" MongoDB collection
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt fields
);

// pre("save") hook - Automatically hashes the user's password before saving to the database.
// Only runs when the password field has been changed (not on every save).
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12); // 12 = salt rounds (higher = more secure but slower)
  next();
});

// comparePassword - Compares a plain-text password (from login) against the stored hashed password.
// Returns true if they match, false otherwise.
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
