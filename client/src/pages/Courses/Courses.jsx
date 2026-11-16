import { useEffect, useState } from "react";

import PageTitle from "../../components/ui/PageTitle";
import {
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "../../services/courseService";

const emptyForm = {
  title: "",
  code: "",
  credits: "",
  department: "",
  active: true,
};

function Courses() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    getCourses({ signal: controller.signal })
      .then((result) => {
        if (!controller.signal.aborted) {
          setCourses(result.data);
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

  const loadCourses = async () => {
    try {
      const result = await getCourses();
      setCourses(result.data);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    setNotice("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const course = {
      title: formData.title.trim(),
      code: formData.code.trim(),
      credits: Number(formData.credits),
      department: formData.department.trim(),
      active: formData.active,
    };

    try {
      if (editingId) {
        const result = await updateCourse(editingId, course);
        setCourses((current) =>
          current.map((item) => (item._id === editingId ? result.data : item))
        );
        setNotice("Course updated successfully.");
      } else {
        const result = await createCourse(course);
        setCourses((current) => [result.data, ...current]);
        setNotice("Course created successfully.");
      }

      setFormData(emptyForm);
      setEditingId("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course._id);
    setFormData({
      title: course.title,
      code: course.code,
      credits: String(course.credits),
      department: course.department,
      active: course.active,
    });
    setError("");
    setNotice("");
    document.getElementById("course-title")?.focus();
  };

  const handleCancelEdit = () => {
    setEditingId("");
    setFormData(emptyForm);
    setError("");
    setNotice("");
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Are you sure you want to delete ${course.title}?`)) {
      return;
    }

    setDeletingId(course._id);
    setError("");
    setNotice("");

    try {
      await deleteCourse(course._id);
      setCourses((current) =>
        current.filter((item) => item._id !== course._id)
      );

      if (editingId === course._id) {
        handleCancelEdit();
      }

      setNotice("Course deleted successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <section className="module-management">
      <header className="module-management__header">
        <PageTitle
          title="Courses"
          description="Create, view, update, and remove courses from the course catalog."
        />
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

      <section className="module-panel" aria-labelledby="course-form-title">
        <h2 id="course-form-title">{editingId ? "Edit course" : "Add a course"}</h2>
        <form className="module-form" onSubmit={handleSubmit}>
          <div className="module-form__grid">
            <div className="module-form__field">
              <label htmlFor="course-title">Course title *</label>
              <input
                id="course-title"
                maxLength={120}
                minLength={2}
                name="title"
                onChange={handleChange}
                required
                value={formData.title}
              />
            </div>

            <div className="module-form__field">
              <label htmlFor="course-code">Course code *</label>
              <input
                id="course-code"
                maxLength={20}
                minLength={2}
                name="code"
                onChange={handleChange}
                pattern={"[A-Za-z0-9\\-]+"}
                required
                value={formData.code}
              />
            </div>

            <div className="module-form__field">
              <label htmlFor="course-credits">Credits *</label>
              <input
                id="course-credits"
                max="30"
                min="1"
                name="credits"
                onChange={handleChange}
                required
                step="1"
                type="number"
                value={formData.credits}
              />
            </div>

            <div className="module-form__field">
              <label htmlFor="course-department">Department *</label>
              <input
                id="course-department"
                maxLength={100}
                minLength={2}
                name="department"
                onChange={handleChange}
                required
                value={formData.department}
              />
            </div>
          </div>

          <label className="module-form__checkbox" htmlFor="course-active">
            <input
              checked={formData.active}
              id="course-active"
              name="active"
              onChange={handleChange}
              type="checkbox"
            />
            Active course
          </label>

          <div className="module-form__actions">
            <button disabled={saving} type="submit">
              {saving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Add course"}
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

      <section className="module-panel" aria-labelledby="course-list-title">
        <div className="module-list__heading">
          <div>
            <h2 id="course-list-title">Course catalog</h2>
            {!loading && !error && (
              <p>{courses.length} course{courses.length === 1 ? "" : "s"}</p>
            )}
          </div>
          <button
            className="module-button--secondary"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              setError("");
              setNotice("");
              loadCourses();
            }}
            type="button"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <p className="module-list__message" role="status">
            Loading courses...
          </p>
        ) : error && courses.length === 0 ? (
          <p className="module-list__message">
            Unable to load courses. Use Refresh to try again.
          </p>
        ) : courses.length === 0 ? (
          <p className="module-list__message">
            No courses found. Add the first course above.
          </p>
        ) : (
          <div className="module-table__scroll">
            <table className="module-table">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Code</th>
                  <th scope="col">Credits</th>
                  <th scope="col">Department</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td>{course.title}</td>
                    <td>{course.code}</td>
                    <td>{course.credits}</td>
                    <td>{course.department}</td>
                    <td>
                      <span
                        className={`module-status module-status--${course.active ? "active" : "inactive"}`}
                      >
                        {course.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="module-row__actions">
                        <button
                          className="module-button--secondary"
                          disabled={Boolean(deletingId)}
                          onClick={() => handleEdit(course)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="module-button--danger"
                          disabled={Boolean(deletingId)}
                          onClick={() => handleDelete(course)}
                          type="button"
                        >
                          {deletingId === course._id ? "Deleting..." : "Delete"}
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

export default Courses;
