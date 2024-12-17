export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: new AuthError('Invalid email or password', 'INVALID_CREDENTIALS', 401),
  EMAIL_EXISTS: new AuthError('Email already registered', 'EMAIL_EXISTS', 409),
  UNVERIFIED_EMAIL: new AuthError('Please verify your email address', 'UNVERIFIED_EMAIL', 403),
  SESSION_EXPIRED: new AuthError('Session expired. Please sign in again', 'SESSION_EXPIRED', 401),
  NETWORK_ERROR: new AuthError('Network error. Please check your connection', 'NETWORK_ERROR', 503),
};