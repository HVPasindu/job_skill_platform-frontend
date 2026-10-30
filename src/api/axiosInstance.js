// Axios is the HTTP library. This shared instance holds the backend URL and token attachment.
import axios from "axios";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const axiosInstance = axios.create({ baseURL: API_BASE_URL, timeout: 20000 });

// Step 02 will save the JWT. This keeps future authenticated calls in one place.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default axiosInstance;
