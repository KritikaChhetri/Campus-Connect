const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const STUDENTS_URL = `${API_BASE_URL.replace(/\/+$/, "")}/students`;

const request = async (path = "", options = {}) => {
  let response;

  try {
    response = await fetch(`${STUDENTS_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error(
      "Unable to connect to the Campus Connect API. Check that the backend is running."
    );
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "The student request could not be completed.");
  }

  return result;
};

export const getStudents = (options = {}) => request("", options);

export const createStudent = (student) =>
  request("", {
    method: "POST",
    body: JSON.stringify(student),
  });

export const updateStudent = (id, student) =>
  request(`/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(student),
  });

export const deleteStudent = (id) =>
  request(`/${encodeURIComponent(id)}`, { method: "DELETE" });
