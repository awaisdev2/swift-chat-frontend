import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:6011";

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("__session");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized, logging out...");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
