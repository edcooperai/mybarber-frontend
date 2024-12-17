import api from '../../api/axios';
import { LoginData, RegisterData, AuthResponse } from '../../types/auth';

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/auth/password-reset-request', { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post(`/auth/password-reset/${token}`, { password });
  },

  async verifyEmail(token: string): Promise<void> {
    await api.get(`/auth/verify-email/${token}`);
  }
};