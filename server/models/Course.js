const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [2, "Course title must be at least 2 characters long"],
      maxlength: [120, "Course title cannot exceed 120 characters"],
    },

    code: {
      type: String,
      required: [true, "Course code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [2, "Course code must be at least 2 characters long"],
      maxlength: [20, "Course code cannot exceed 20 characters"],
      match: [/^[A-Z0-9-]+$/, "Course code may only contain letters, numbers, and hyphens"],
    },

    credits: {
      type: Number,
      required: [true, "Course credits are required"],
      min: [1, "Course credits must be at least 1"],
      max: [30, "Course credits cannot exceed 30"],
      validate: {
        validator: Number.isInteger,
        message: "Course credits must be a whole number",
      },
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      minlength: [2, "Department must be at least 2 characters long"],
      maxlength: [100, "Department cannot exceed 100 characters"],
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
