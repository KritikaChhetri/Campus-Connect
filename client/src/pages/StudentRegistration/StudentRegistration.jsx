import { useState } from "react";

function StudentRegistration() {
  const initialFormData = {
    studentId: "",
    fullName: "",
    email: "",
    phone: "",
    course: "",
    semester: "",
    gender: "",
    password: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });

    setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required.";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must contain at least 3 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must contain 10 digits.";
    }

    if (!formData.course) {
      newErrors.course = "Please select a course.";
    }

    if (!formData.semester) {
      newErrors.semester = "Please select a semester.";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must contain at least 6 characters.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage("");
      return;
    }

    console.log("Student Registration Data:", formData);

    setSuccessMessage("Student registered successfully!");
    setErrors({});
    setFormData(initialFormData);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <div className="registration-page">
      <div className="registration-header">
        <span className="registration-badge">Campus Connect</span>
        <h1>Student Registration</h1>
        <p>Fill in the details below to register a student.</p>
      </div>

      <div className="registration-card">
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label>Student ID *</label>
              <input
                type="text"
                name="studentId"
                placeholder="Enter student ID"
                value={formData.studentId}
                onChange={handleChange}
              />
              {errors.studentId && (
                <p className="error-message">{errors.studentId}</p>
              )}
            </div>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && (
                <p className="error-message">{errors.fullName}</p>
              )}
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="error-message">{errors.email}</p>
              )}
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="error-message">{errors.phone}</p>
              )}
            </div>

            <div className="form-group">
              <label>Course *</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
              >
                <option value="">Select course</option>
                <option value="BCA">BCA</option>
                <option value="BBA">BBA</option>
                <option value="MCA">MCA</option>
              </select>
              {errors.course && (
                <p className="error-message">{errors.course}</p>
              )}
            </div>

            <div className="form-group">
              <label>Semester *</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
              >
                <option value="">Select semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
              </select>
              {errors.semester && (
                <p className="error-message">{errors.semester}</p>
              )}
            </div>

            <div className="form-group">
              <label>Gender *</label>

              <div className="gender-options">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleChange}
                  />
                  Female
                </label>

                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}
                  />
                  Male
                </label>
              </div>

              {errors.gender && (
                <p className="error-message">{errors.gender}</p>
              )}
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleReset}>
              Reset
            </button>

            <button type="submit">
              Register Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentRegistration;