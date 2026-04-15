import axios from "axios";

const AUTH_BASE = "http://localhost:5000/api/auth";

// loginUser - Sends a POST request to the backend with email and password.
// Returns the JWT token and user info if credentials are correct.
export const loginUser = async (email, password) => {
  const res = await axios.post(`${AUTH_BASE}/login`, { email, password });
  return res.data;
};

// registerUser - Sends a POST request to the backend to create a new user account.
// Returns the JWT token and user info on successful registration.
export const registerUser = async (name, email, password) => {
  const res = await axios.post(`${AUTH_BASE}/register`, { name, email, password });
  return res.data;
};
