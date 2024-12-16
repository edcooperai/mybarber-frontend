import api from './axios';
import { API_ENDPOINTS } from '../constants/api';
import type { LoginData, RegisterData } from '../types';

export const login = async (data: LoginData) => {
  const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, data);
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
  return response.data;
};

export const refreshToken = async (refreshToken: string) => {
  const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
  return response.data;
};

export const requestPasswordReset = async (email: string) => {
  const response = await api.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_REQUEST, { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await api.post(`${API_ENDPOINTS.AUTH.PASSWORD_RESET}/${token}`, { password });
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await api.get(`${API_ENDPOINTS.AUTH.VERIFY_EMAIL}/${token}`);
  return response.data;
};

export const setup2FA = async (token: string) => {
  const response = await api.post('/api/auth/2fa/setup', null, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const verify2FA = async (token: string, code: string) => {
  const response = await api.post('/api/auth/2fa/verify', { code }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const disable2FA = async (token: string, code: string) => {
  const response = await api.post('/api/auth/2fa/disable', { code }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};