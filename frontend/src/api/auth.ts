import axiosClient from "./axiosClient";

export async function refreshToken() {
  const { data } = await axiosClient.post("/auth/refresh");
  localStorage.setItem("accessToken", data.accessToken);
  return data.accessToken;
}

// Intercepteur pour les erreurs 401
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Redirection vers /login si le refresh échoue
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
