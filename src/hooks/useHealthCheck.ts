import { useState, useEffect, useCallback } from 'react';
import { checkApiHealth } from '../api/health';

export type HealthStatus = 'loading' | 'connected' | 'error';

export const useHealthCheck = (checkInterval = 30000) => {
  const [status, setStatus] = useState<HealthStatus>('loading');

  const performHealthCheck = useCallback(async () => {
    try {
      const response = await checkApiHealth();
      setStatus(response.status === 'success' ? 'connected' : 'error');
    } catch (error) {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    // Initial check
    performHealthCheck();

    // Set up periodic checks
    const interval = setInterval(performHealthCheck, checkInterval);

    // Cleanup
    return () => clearInterval(interval);
  }, [checkInterval, performHealthCheck]);

  return status;
};