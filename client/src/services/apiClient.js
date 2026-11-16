const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export const apiRequest = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
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
    throw new Error(result.message || "The API request could not be completed.");
  }

  return result;
};

export const createCrudService = (resource) => {
  const resourcePath = `/${resource}`;
  return {
    getAll: (options = {}) => apiRequest(resourcePath, options),
    getById: (id, options = {}) =>
      apiRequest(`${resourcePath}/${encodeURIComponent(id)}`, options),
    create: (record) =>
      apiRequest(resourcePath, {
        method: "POST",
        body: JSON.stringify(record),
      }),
    update: (id, record) =>
      apiRequest(`${resourcePath}/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify(record),
      }),
    remove: (id) =>
      apiRequest(`${resourcePath}/${encodeURIComponent(id)}`, {
        method: "DELETE",
      }),
  };
};
