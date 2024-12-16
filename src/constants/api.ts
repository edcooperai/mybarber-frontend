export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    PASSWORD_RESET_REQUEST: '/api/auth/password-reset-request',
    PASSWORD_RESET: '/api/auth/password-reset',
    VERIFY_EMAIL: '/api/auth/verify-email',
  },
  APPOINTMENTS: {
    BASE: '/api/appointments',
    GET_ALL: '/api/appointments',
    CREATE: '/api/appointments',
    UPDATE: (id: string) => `/api/appointments/${id}`,
    DELETE: (id: string) => `/api/appointments/${id}`,
  },
  CLIENTS: {
    BASE: '/api/clients',
    GET_ALL: '/api/clients',
    CREATE: '/api/clients',
    UPDATE: (id: string) => `/api/clients/${id}`,
    DELETE: (id: string) => `/api/clients/${id}`,
  },
  SERVICES: {
    BASE: '/api/services',
    GET_ALL: '/api/services',
    CREATE: '/api/services',
    UPDATE: (id: string) => `/api/services/${id}`,
    DELETE: (id: string) => `/api/services/${id}`,
  },
  SETTINGS: {
    BASE: '/api/settings',
    GET: '/api/settings',
    UPDATE: '/api/settings',
  },
  HEALTH: '/api/health',
};