import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./tokenManager";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // para enviar o cookie de refresh
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: AxiosError) => void;
}[] = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach(p => {
    error ? p.reject(error) : p.resolve(token!);
  });
  failedQueue = [];
};

api.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (  
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.endsWith("/login") &&
      !originalRequest.url?.includes("/login/refresh")
    ) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`,
          };
          return api(originalRequest);
        });
      }

      isRefreshing = true;
      try {
        const res = await api.post("/login/refresh");
        const newToken = res.data.token;

        setAccessToken(newToken);
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return api(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        clearAccessToken();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;