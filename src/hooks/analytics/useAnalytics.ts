import { useState, useCallback } from 'react';
import { analyticsService } from '../../services/analytics/analyticsService';
import { showErrorToast } from '../../services/error/errorHandler';
import type { AnalyticsData } from '../../types/analytics';

export const useAnalytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);

  const fetchRevenueStats = useCallback(async (startDate: Date, endDate: Date) => {
    setIsLoading(true);
    try {
      const stats = await analyticsService.getRevenueStats(startDate, endDate);
      setData(stats);
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    data,
    fetchRevenueStats
  };
};