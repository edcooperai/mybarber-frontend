import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export const HealthCheck: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.get('/health');
        setStatus('connected');
      } catch (error) {
        setStatus('error');
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="fixed bottom-4 right-4">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
        status === 'connected' ? 'bg-green-500/20 text-green-500' :
        status === 'error' ? 'bg-red-500/20 text-red-500' :
        'bg-gray-500/20 text-gray-500'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          status === 'connected' ? 'bg-green-500' :
          status === 'error' ? 'bg-red-500' :
          'bg-gray-500'
        }`} />
        {status === 'connected' ? 'Connected to API' :
         status === 'error' ? 'API Connection Error' :
         'Checking Connection...'}
      </div>
    </div>
  );
};