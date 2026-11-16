const mongoose = require("mongoose");
const Student = require("../models/Student");

const studentFields = new Set(["name", "email", "course", "age", "status"]);

const getStudentData = (body) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Student data must be a JSON object." };
  }

  const unknownFields = Object.keys(body).filter(
    (field) => !studentFields.has(field)
  );

  if (unknownFields.length > 0) {
    return {
      error: `Unsupported student field(s): ${unknownFields.join(", ")}.`,
    };
  }

  if (Object.keys(body).length === 0) {
    return { error: "Student data is required." };
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
          ? "A student with the submitted unique value already exists."
          : error.message,
    });
  }

  console.error(`Failed to ${operation}:`, error);
  return res.status(500).json({
    success: false,
    message: `Failed to ${operation}.`,
  });
};

const isValidStudentId = (id) => mongoose.isValidObjectId(id);

const getStudents = async (req, res) => {
  try {
    const students = await Student.find();

    return res.status(200).json({
      success: true,
      message: "Students retrieved successfully.",
      data: students,
    });
  } catch (error) {
    return sendOperationError(res, error, "retrieve students");
  }
};

const getStudentById = async (req, res) => {
  if (!isValidStudentId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid student ID.",
    });
  }

  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student retrieved successfully.",
      data: student,
    });
  } catch (error) {
    return sendOperationError(res, error, "retrieve student");
  }
};

const createStudent = async (req, res) => {
  const result = getStudentData(req.body);

  if (result.error) {
    return res.status(400).json({
      success: false,
      message: result.error,
    });
  }

  try {
    const student = await Student.create(result.data);

    return res.status(201).json({
      success: true,
      message: "Student created successfully.",
      data: student,
    });
  } catch (error) {
    return sendOperationError(res, error, "create student");
  }
};

const updateStudent = async (req, res) => {
  if (!isValidStudentId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid student ID.",
    });
  }

  const result = getStudentData(req.body);

  if (result.error) {
    return res.status(400).json({
      success: false,
      message: result.error,
    });
  }

  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: result.data },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully.",
      data: student,
    });
  } catch (error) {
    return sendOperationError(res, error, "update student");
  }
};

const deleteStudent = async (req, res) => {
  if (!isValidStudentId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid student ID.",
    });
  }

  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully.",
      data: student,
    });
  } catch (error) {
    return sendOperationError(res, error, "delete student");
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
