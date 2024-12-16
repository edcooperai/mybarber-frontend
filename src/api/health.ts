import { api } from './index';

export interface HealthCheckResponse {
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

export const checkApiHealth = async (): Promise<HealthCheckResponse> => {
  try {
    const response = await api.get<HealthCheckResponse>('/api/health');
    return response.data;
  } catch (error) {
    throw new Error('Health check failed');
  }
};