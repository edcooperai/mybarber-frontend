import { apiClient } from '../api/apiClient';
import type { AnalyticsData } from '../../types/analytics';

export const analyticsService = {
  async getRevenueStats(startDate: Date, endDate: Date): Promise<AnalyticsData> {
    const response = await apiClient.get('/analytics/revenue', {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
    return response.data;
  },

  async getClientStats(): Promise<AnalyticsData> {
    const response = await apiClient.get('/analytics/clients');
    return response.data;
  },

  async getServiceStats(): Promise<AnalyticsData> {
    const response = await apiClient.get('/analytics/services');
    return response.data;
  }
};