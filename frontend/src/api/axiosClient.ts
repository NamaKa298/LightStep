import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.VITE_API_URL,
  withCredentials: true,
});

// Intercepteur pour injecter le JWT
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
