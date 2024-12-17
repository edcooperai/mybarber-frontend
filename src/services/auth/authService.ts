import api from '../../api/axios';
import { LoginData, RegisterData, AuthResponse } from '../../types/auth';
import { AUTH_ERRORS, AuthError } from './errors';
import { validateLoginData, validateRegisterData } from './validators';
import { logger } from '../../utils/logger';

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    // Validate input data
    const validation = validateLoginData(data);
    if (!validation.isValid) {
      throw new AuthError(validation.error!, 'VALIDATION_ERROR');
    }

    try {
      logger.info('Attempting login:', { email: data.email });
      const response = await api.post<AuthResponse>('/auth/login', data);
      logger.info('Login successful:', { email: data.email });
      return response.data;
    } catch (error: any) {
      logger.error('Login failed:', { error: error.response?.data || error.message });
      
      if (!error.response) {
        throw AUTH_ERRORS.NETWORK_ERROR;
      }

      switch (error.response.status) {
        case 401:
          throw AUTH_ERRORS.INVALID_CREDENTIALS;
        case 403:
          throw AUTH_ERRORS.UNVERIFIED_EMAIL;
        default:
          throw new AuthError(
            error.response?.data?.message || 'Login failed',
            'LOGIN_ERROR',
            error.response?.status
          );
      }
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    // Validate input data
    const validation = validateRegisterData(data);
    if (!validation.isValid) {
      throw new AuthError(validation.error!, 'VALIDATION_ERROR');
    }

    try {
      logger.info('Attempting registration:', { email: data.email });
      const response = await api.post<AuthResponse>('/auth/register', data);
      logger.info('Registration successful:', { email: data.email });
      return response.data;
    } catch (error: any) {
      logger.error('Registration failed:', { error: error.response?.data || error.message });

      if (!error.response) {
        throw AUTH_ERRORS.NETWORK_ERROR;
      }

      if (error.response.status === 409) {
        throw AUTH_ERRORS.EMAIL_EXISTS;
      }

      throw new AuthError(
        error.response?.data?.message || 'Registration failed',
        'REGISTRATION_ERROR',
        error.response?.status
      );
    }
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      logger.info('Attempting token refresh');
      const response = await api.post<AuthResponse>('/auth/refresh-token', { refreshToken });
      logger.info('Token refresh successful');
      return response.data;
    } catch (error: any) {
      logger.error('Token refresh failed:', { error: error.response?.data || error.message });
      throw AUTH_ERRORS.SESSION_EXPIRED;
    }
  }
};