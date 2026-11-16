import { useEffect, useState } from "react";

import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from "../../services/studentService";

const emptyForm = {
  name: "",
  email: "",
  course: "",
  age: "",
  status: "active",
};

function StudentRegistration() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    getStudents({ signal: controller.signal })
      .then((result) => {
        if (!controller.signal.aborted) {
          setStudents(result.data);
        }
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const loadStudents = async () => {
    try {
      const result = await getStudents();
      setStudents(result.data);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError("");
    setNotice("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const student = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      course: formData.course.trim(),
      status: formData.status,
    };

    if (formData.age !== "") {
      student.age = Number(formData.age);
    }

    try {
      if (editingId) {
        const result = await updateStudent(editingId, student);
        setStudents((current) =>
          current.map((item) =>
            item._id === editingId ? result.data : item
          )
        );
        setNotice("Student updated successfully.");
      } else {
        const result = await createStudent(student);
        setStudents((current) => [result.data, ...current]);
        setNotice("Student registered successfully.");
      }

      setFormData(emptyForm);
      setEditingId("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setFormData({
      name: student.name,
      email: student.email,
      course: student.course,
      age: student.age === undefined ? "" : String(student.age),
      status: student.status,
    });
    setError("");
    setNotice("");
    document.getElementById("student-name")?.focus();
  };

  const handleCancelEdit = () => {
    setEditingId("");
    setFormData(emptyForm);
    setError("");
    setNotice("");
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      return;
    }

    setDeletingId(student._id);
    setError("");
    setNotice("");

    try {
      await deleteStudent(student._id);
      setStudents((current) =>
        current.filter((item) => item._id !== student._id)
      );

      if (editingId === student._id) {
        handleCancelEdit();
      }

      setNotice("Student deleted successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <section className="module-management">
      <header className="module-management__header">
        <span className="registration-badge">Campus Connect</span>
        <h1>Student Management</h1>
        <p>Create, view, update, and remove students from the student database.</p>
      </header>

      {notice && (
        <p className="module-feedback module-feedback--success" role="status">
          {notice}
        </p>
      )}
      {error && (
        <p className="module-feedback module-feedback--error" role="alert">
          {error}
        </p>
      )}

      <section className="module-panel" aria-labelledby="student-form-title">
        <h2 id="student-form-title">
          {editingId ? "Edit student" : "Register a student"}
        </h2>
        <form className="module-form" onSubmit={handleSubmit}>
          <div className="module-form__grid">
            <div className="module-form__field">
              <label htmlFor="student-name">Full name *</label>
              <input
                autoComplete="name"
                id="student-name"
                maxLength={120}
                name="name"
                onChange={handleChange}
                required
                value={formData.name}
              />
            </div>

            <div className="module-form__field">
              <label htmlFor="student-email">Email *</label>
              <input
                autoComplete="email"
                id="student-email"
                name="email"
                onChange={handleChange}
                required
                type="email"
                value={formData.email}
              />
            </div>

            <div className="module-form__field">
              <label htmlFor="student-course">Course *</label>
              <input
                id="student-course"
                name="course"
                onChange={handleChange}
                required
                value={formData.course}
              />
            </div>

            <div className="module-form__field">
              <label htmlFor="student-age">Age</label>
              <input
                id="student-age"
                max="100"
                min="16"
                name="age"
                onChange={handleChange}
                type="number"
                value={formData.age}
              />
            </div>

            <div className="module-form__field">
              <label htmlFor="student-status">Status</label>
              <select
                id="student-status"
                name="status"
                onChange={handleChange}
                value={formData.status}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="module-form__actions">
            <button disabled={saving} type="submit">
              {saving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Register student"}
            </button>
            {editingId && (
              <button
                className="module-button--secondary"
                disabled={saving}
                onClick={handleCancelEdit}
                type="button"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="module-panel" aria-labelledby="student-list-title">
        <div className="module-list__heading">
          <div>
            <h2 id="student-list-title">Registered students</h2>
            {!loading && !error && (
              <p>{students.length} student{students.length === 1 ? "" : "s"}</p>
            )}
          </div>
          <button
            className="module-button--secondary"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              setError("");
              setNotice("");
              loadStudents();
            }}
            type="button"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <p className="module-list__message" role="status">
            Loading students...
          </p>
        ) : error && students.length === 0 ? (
          <p className="module-list__message">
            Unable to load students. Use Refresh to try again.
          </p>
        ) : students.length === 0 ? (
          <p className="module-list__message">
            No students found. Register the first student above.
          </p>
        ) : (
          <div className="module-table__scroll">
            <table className="module-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Course</th>
                  <th scope="col">Age</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.course}</td>
                    <td>{student.age ?? "N/A"}</td>
                    <td>
                      <span
                        className={`module-status module-status--${student.status}`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <div className="module-row__actions">
                        <button
                          className="module-button--secondary"
                          disabled={Boolean(deletingId)}
                          onClick={() => handleEdit(student)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="module-button--danger"
                          disabled={Boolean(deletingId)}
                          onClick={() => handleDelete(student)}
                          type="button"
                        >
                          {deletingId === student._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}

export default StudentRegistration;
