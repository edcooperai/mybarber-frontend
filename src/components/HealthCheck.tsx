import React, { memo, useEffect, useState, useCallback } from 'react';
import { checkApiHealth } from '../api/health';
import { toast } from 'react-hot-toast';

export const HealthCheck: React.FC = memo(() => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');

  const checkHealth = useCallback(async () => {
    try {
      const response = await checkApiHealth();
      const newStatus = response.status === 'success' ? 'connected' : 'error';
      
      // Only update status and show toast if status changed
      setStatus(prevStatus => {
        if (prevStatus !== newStatus && newStatus === 'error') {
          toast.error('API connection error. Some features may be unavailable.');
        }
        return newStatus;
      });
    } catch (error) {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkHealth();

    // Set up periodic checks
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, [checkHealth]);

  if (status === 'loading') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
        status === 'connected' 
          ? 'bg-green-500/20 text-green-500' 
          : 'bg-red-500/20 text-red-500'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          status === 'connected' ? 'bg-green-500' : 'bg-red-500'
        }`} />
        {status === 'connected' ? 'API Connected' : 'API Connection Error'}
      </div>
    </div>
  );
});

HealthCheck.displayName = 'HealthCheck';