import React from 'react';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';

interface BalanceDisplayProps {
  balance: number;
  lastChange?: number;
  round: number;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance, lastChange, round }) => {
  const coinCount = Math.min(Math.floor(balance / 5), 10);
  
  return (
    <div className="bg-wealthsimple-gold rounded-3xl p-8 shadow-xl border-4 border-yellow-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-black flex items-center gap-2 text-wealthsimple-black">
          <span className="text-4xl">💰</span>
          Your Money
        </h2>
        <div className="text-lg bg-wealthsimple-black text-wealthsimple-gold px-4 py-2 rounded-full font-black flex items-center gap-2">
          <Star className="fill-wealthsimple-gold" size={20} />
          Round {round}
        </div>
      </div>
      
      <div className="text-7xl font-black mb-3 text-wealthsimple-black">
        ${balance.toFixed(2)}
      </div>
      
      <div className="flex gap-2 mb-3 flex-wrap">
        {Array.from({ length: coinCount }).map((_, i) => (
          <span key={i} className="text-3xl">🪙</span>
        ))}
        {balance > 50 && <span className="text-3xl">💎</span>}
      </div>
      
      {lastChange !== undefined && lastChange !== 0 && (
        <div className={`flex items-center gap-2 text-xl font-black ${
          lastChange > 0 ? 'text-green-700' : 'text-red-700'
        }`}>
          {lastChange > 0 ? (
            <>
              <TrendingUp size={28} />
              <span>+${Math.abs(lastChange).toFixed(2)} 🎉</span>
            </>
          ) : (
            <>
              <TrendingDown size={28} />
              <span>-${Math.abs(lastChange).toFixed(2)} 😢</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};