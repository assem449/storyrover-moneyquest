import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface BalanceDisplayProps {
  balance: number;
  lastChange?: number;
  round: number;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance, lastChange, round }) => {
  return (
    <div className="bg-gradient-to-br from-wealthsimple-black to-gray-900 rounded-2xl p-8 text-white shadow-2xl border-2 border-wealthsimple-gold">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <DollarSign className="text-wealthsimple-gold" size={32} />
          Your Money
        </h2>
        <div className="text-sm bg-wealthsimple-gold text-wealthsimple-black px-3 py-1 rounded-full font-bold">
          Round {round}
        </div>
      </div>
      
      <div className="text-6xl font-bold mb-2">
        ${balance.toFixed(2)}
      </div>
      
      {lastChange !== undefined && lastChange !== 0 && (
        <div className={`flex items-center gap-2 text-lg font-semibold ${
          lastChange > 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {lastChange > 0 ? (
            <>
              <TrendingUp size={20} />
              +${Math.abs(lastChange).toFixed(2)}
            </>
          ) : (
            <>
              <TrendingDown size={20} />
              -${Math.abs(lastChange).toFixed(2)}
            </>
          )}
        </div>
      )}
    </div>
  );
};
