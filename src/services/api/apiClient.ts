import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '../../store/authStore';
import { API_ENDPOINTS } from '../../constants';

class ApiClient {
  private static instance: ApiClient;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await useAuthStore.getState().refreshAccessToken();
            const token = useAuthStore.getState().token;
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            useAuthStore.getState().clearAuth();
            throw refreshError;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public getApi(): AxiosInstance {
    return this.api;
  }
}

export const apiClient = ApiClient.getInstance().getApi();