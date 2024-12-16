import api from './axios';

export interface HealthCheckResponse {
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

export const checkApiHealth = async (): Promise<HealthCheckResponse> => {
  try {
    const response = await api.get<HealthCheckResponse>('/api/health');
    return {
      status: response.data.status,
      message: response.data.message,
      timestamp: response.data.timestamp
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    };
  }
};