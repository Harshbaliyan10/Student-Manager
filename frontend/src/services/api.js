import axios from "axios";

const API_BASE = "http://localhost:5000/api/students";

// Axios request interceptor - Automatically attaches the JWT token to every outgoing API request.
// Reads the token from localStorage and adds it as an Authorization header.
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const api = {
  // getAll - Fetches all student records from the backend
  getAll: () => axios.get(API_BASE),

  // getById - Fetches a single student record by their database ID
  getById: (id) => axios.get(`${API_BASE}/${id}`),

  // create - Sends a new student's data to the backend to be saved in the database
  create: (data) => axios.post(API_BASE, data),

  // update - Sends updated data for an existing student identified by their ID
  update: (id, data) => axios.put(`${API_BASE}/${id}`, data),

  // delete - Deletes a student from the database using their ID
  delete: (id) => axios.delete(`${API_BASE}/${id}`),
};

export default api;
