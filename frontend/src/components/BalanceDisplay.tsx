import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Star } from 'lucide-react';

interface BalanceDisplayProps {
  balance: number;
  lastChange?: number;
  round: number;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance, lastChange, round }) => {
  // Show coins visually
  const coinCount = Math.min(Math.floor(balance / 5), 10); // Max 10 coins shown
  
  return (
    <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-3xl p-10 text-white shadow-2xl border-8 border-yellow-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-4xl font-black flex items-center gap-3">
          <span className="text-5xl">💰</span>
          Your Money
        </h2>
        <div className="text-xl bg-white text-yellow-600 px-6 py-3 rounded-full font-black flex items-center gap-2 shadow-lg">
          <Star className="fill-yellow-400" size={24} />
          Round {round}
        </div>
      </div>
      
      <div className="text-8xl font-black mb-4 text-shadow">
        ${balance.toFixed(2)}
      </div>
      
      {/* Visual coin representation */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {Array.from({ length: coinCount }).map((_, i) => (
          <span key={i} className="text-4xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
            🪙
          </span>
        ))}
        {balance > 50 && <span className="text-4xl">✨💎✨</span>}
      </div>
      
      {lastChange !== undefined && lastChange !== 0 && (
        <div className={`flex items-center gap-3 text-2xl font-black ${
          lastChange > 0 ? 'text-green-200' : 'text-red-200'
        }`}>
          {lastChange > 0 ? (
            <>
              <TrendingUp size={32} className="animate-bounce" />
              <span>+${Math.abs(lastChange).toFixed(2)} 🎉</span>
            </>
          ) : (
            <>
              <TrendingDown size={32} />
              <span>-${Math.abs(lastChange).toFixed(2)} 😢</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};