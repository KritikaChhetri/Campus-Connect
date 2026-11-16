const mongoose = require("mongoose");
const Course = require("../models/Course");

const courseFields = new Set(["title", "code", "credits", "department", "active"]);

const getCourseData = (body) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Course data must be a JSON object." };
  }

  const unknownFields = Object.keys(body).filter(
    (field) => !courseFields.has(field)
  );

  if (unknownFields.length > 0) {
    return {
      error: `Unsupported course field(s): ${unknownFields.join(", ")}.`,
    };
  }

  if (Object.keys(body).length === 0) {
    return { error: "Course data is required." };
  }

  return { data: body };
};

const sendOperationError = (res, error, operation) => {
  if (
    error.name === "ValidationError" ||
    error.name === "CastError" ||
    error.code === 11000
  ) {
    return res.status(400).json({
      success: false,
      message:
        error.code === 11000
          ? "A course with this code already exists."
          : error.message,
    });
  }

  console.error(`Failed to ${operation}:`, error);
  return res.status(500).json({
    success: false,
    message: `Failed to ${operation}.`,
  });
};

const isValidCourseId = (id) => mongoose.isValidObjectId(id);

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    return res.status(200).json({
      success: true,
      message: "Courses retrieved successfully.",
      data: courses,
    });
  } catch (error) {
    return sendOperationError(res, error, "retrieve courses");
  }
};

const getCourseById = async (req, res) => {
  if (!isValidCourseId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid course ID.",
    });
  }

  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course retrieved successfully.",
      data: course,
    });
  } catch (error) {
    return sendOperationError(res, error, "retrieve course");
  }
};

const createCourse = async (req, res) => {
  const result = getCourseData(req.body);

  if (result.error) {
    return res.status(400).json({
      success: false,
      message: result.error,
    });
  }

  try {
    const course = await Course.create(result.data);

    return res.status(201).json({
      success: true,
      message: "Course created successfully.",
      data: course,
    });
  } catch (error) {
    return sendOperationError(res, error, "create course");
  }
};

const updateCourse = async (req, res) => {
  if (!isValidCourseId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid course ID.",
    });
  }

  const result = getCourseData(req.body);

  if (result.error) {
    return res.status(400).json({
      success: false,
      message: result.error,
    });
  }

  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: result.data },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      data: course,
    });
  } catch (error) {
    return sendOperationError(res, error, "update course");
  }
};

const deleteCourse = async (req, res) => {
  if (!isValidCourseId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid course ID.",
    });
  }

  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
      data: course,
    });
  } catch (error) {
    return sendOperationError(res, error, "delete course");
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
