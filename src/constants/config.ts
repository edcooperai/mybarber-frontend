export const CONFIG = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    version: import.meta.env.VITE_API_VERSION || 'v1',
    timeout: 10000,
  },
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    tokenExpiry: 15 * 60 * 1000, // 15 minutes
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  features: {
    googleLogin: import.meta.env.VITE_ENABLE_GOOGLE_LOGIN === 'true',
    appleLogin: import.meta.env.VITE_ENABLE_APPLE_LOGIN === 'true',
  },
  calendar: {
    defaultView: 'week',
    startHour: 9,
    endHour: 18,
    slotDuration: 30, // minutes
  },
  booking: {
    minAdvanceTime: 24, // hours
    maxAdvanceTime: 30, // days
  },
};