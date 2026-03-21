import axios from "axios";

// Get backend URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5051";

// Create axios instance with credentials enabled
const instance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

export default instance;