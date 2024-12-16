import { useState, useEffect } from 'react';
import { checkApiHealth } from '../api/health';

export type HealthStatus = 'loading' | 'connected' | 'error';

export const useHealthCheck = (checkInterval = 30000) => {
  const [status, setStatus] = useState<HealthStatus>('loading');

  useEffect(() => {
    const performHealthCheck = async () => {
      try {
        const response = await checkApiHealth();
        setStatus(response.status === 'success' ? 'connected' : 'error');
      } catch (error) {
        setStatus('error');
      }
    };

    // Initial check
    performHealthCheck();

    // Set up periodic checks
    const interval = setInterval(performHealthCheck, checkInterval);

    // Cleanup
    return () => clearInterval(interval);
  }, [checkInterval]);

  return status;
};