import axios from 'axios';

export interface HealthCheckResponse {
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

// Create a dedicated axios instance for health checks
const healthApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000
});

export const checkApiHealth = async (): Promise<HealthCheckResponse> => {
  try {
    const response = await healthApi.get<HealthCheckResponse>('/api/health');
    return response.data;
  } catch (error) {
    return {
      status: 'error',
      message: 'API is unreachable',
      timestamp: new Date().toISOString()
    };
  }
};