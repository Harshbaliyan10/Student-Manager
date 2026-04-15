const mongoose = require("mongoose");

// Student Schema - Defines the structure for student records stored in the "students" MongoDB collection
const studentSchema = new mongoose.Schema(
  {
    // userId - Links this student record to the account that created it
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,       // no two students can have the same email
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    rollNo: {
      type: String,
      required: [true, "Roll number is required"],
      unique: true,       // no two students can have the same roll number
      trim: true,
    },
    branch: {
      type: String,
      required: [true, "Branch is required"],
      enum: ["CSE", "CSE-DS", "IT", "ECE", "EEE", "ME", "CE", "Other"], // only these values are allowed
    },
    section: {
      type: String,
      enum: ["A", "B", "C", "D"],  // optional class section
      default: null,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: 1,
      max: 4,
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Student", studentSchema);
