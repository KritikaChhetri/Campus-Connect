const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const createCrudService = (resource) => {
  const resourceUrl = `${API_BASE_URL.replace(/\/+$/, "")}/${resource}`;

  const request = async (path = "", options = {}) => {
    let response;

    try {
      response = await fetch(`${resourceUrl}${path}`, {
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
      throw new Error(
        result.message || "The API request could not be completed."
      );
    }

    return result;
  };

  return {
    getAll: (options = {}) => request("", options),
    getById: (id, options = {}) =>
      request(`/${encodeURIComponent(id)}`, options),
    create: (record) =>
      request("", {
        method: "POST",
        body: JSON.stringify(record),
      }),
    update: (id, record) =>
      request(`/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify(record),
      }),
    remove: (id) =>
      request(`/${encodeURIComponent(id)}`, { method: "DELETE" }),
  };
};
