import { apiRequest } from "./apiClient";

export const registerUser = (user) =>
  apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(user),
  });

export const loginUser = (credentials) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
