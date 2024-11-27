import api from './axios';

export interface LoginData {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const login = async (data: LoginData) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const refreshToken = async (refreshToken: string) => {
  const response = await api.post('/auth/refresh-token', { refreshToken });
  return response.data;
};

export const setup2FA = async (token: string) => {
  const response = await api.post('/auth/2fa/setup', null, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const verify2FA = async (token: string, code: string) => {
  const response = await api.post(
    '/auth/2fa/verify',
    { code },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const disable2FA = async (token: string, code: string) => {
  const response = await api.post(
    '/auth/2fa/disable',
    { code },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};