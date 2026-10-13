// Get all students
const getStudents = (req, res) => {
  res.status(200).json({
    message: "All students retrieved successfully",
  });
};

// Get student by ID
const getStudentById = (req, res) => {
  res.status(200).json({
    message: `Student with ID ${req.params.id} retrieved successfully`,
  });
};

// Create student
const createStudent = (req, res) => {
  res.status(201).json({
    message: "Student created successfully",
  });
};

// Update student
const updateStudent = (req, res) => {
  res.status(200).json({
    message: `Student with ID ${req.params.id} updated successfully`,
  });
};

// Delete student
const deleteStudent = (req, res) => {
  res.status(200).json({
    message: `Student with ID ${req.params.id} deleted successfully`,
  });
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};