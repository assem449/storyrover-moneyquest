import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Loader2 className="animate-spin text-wealthsimple-gold" size={48} />
      <p className="text-gray-600 text-lg font-medium">{message}</p>
    </div>
  );
};
