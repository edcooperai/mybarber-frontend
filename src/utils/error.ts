import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || error.message;
    const status = error.response?.status;
    
    // Log error for debugging in production
    console.error('API Error:', {
      status,
      message,
      url: error.config?.url,
      method: error.config?.method
    });
    
    return new AppError(message, 'API_ERROR', status);
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR');
  }

  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR');
};

export const showErrorToast = (error: unknown, customMessage?: string) => {
  const appError = handleApiError(error);
  toast.error(customMessage || appError.message);
};