import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../constants/api';
import { AppError, handleError } from './error';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(handleError(error))
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        await useAuthStore.getState().refreshAccessToken();
        const token = useAuthStore.getState().token;
        error.config!.headers.Authorization = `Bearer ${token}`;
        return api(error.config!);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        throw new AppError('Session expired. Please login again.', 'AUTH_ERROR', 401);
      }
    }
    throw handleError(error);
  }
);

export default api;