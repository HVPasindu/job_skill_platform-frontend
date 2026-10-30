// Axios is the shared HTTP client. Auth endpoints never send an old bearer token.
import axios from "axios";
import { AUTH_EXPIRED_EVENT, getStoredToken } from "../utils/authStorage";
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"
).replace(/\/$/, "");
const axiosInstance = axios.create({ baseURL: API_BASE_URL, timeout: 20000 });
axiosInstance.interceptors.request.use((config) => {
  const token = config.skipAuth ? null : getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const sentToken = error.config?.headers?.Authorization;
    // A late 401 from a previous session must not sign out a newly logged-in user.
    if (
      error.response?.status === 401 &&
      sentToken &&
      sentToken === `Bearer ${getStoredToken()}`
    ) {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  },
);
export default axiosInstance;
