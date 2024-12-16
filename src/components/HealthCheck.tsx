import React, { memo } from 'react';
import { useHealthCheck } from '../hooks/useHealthCheck';

export const HealthCheck: React.FC = memo(() => {
  const status = useHealthCheck();

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