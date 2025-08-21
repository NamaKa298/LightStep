import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

// Création d'une instance axios
const api = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

// ----- Request Interceptor -----
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----- Response Interceptor -----
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // si c'est un 401 et qu'on n'a pas déjà essayé de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // met en attente pendant qu’un refresh est en cours
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await api.post("/auth/refresh"); // appelle ton endpoint refresh
        const newAccessToken = res.data.accessToken;

        // met à jour dans Zustand
        const user = useAuthStore.getState().user;
        useAuthStore.getState().setAuth(newAccessToken, user!);

        processQueue(null, newAccessToken);
        return api(originalRequest); // rejoue la requête échouée
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().clearAuth();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
