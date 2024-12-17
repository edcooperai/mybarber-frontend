import api from '../../api/axios';
import { LoginData, RegisterData, AuthResponse } from '../../types/auth';
import { handleApiError } from '../error/errorHandler';

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/auth/login', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/auth/register', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/auth/refresh-token', { refreshToken });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async verifyEmail(token: string): Promise<void> {
    try {
      await api.get(`/api/auth/verify-email/${token}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }
};