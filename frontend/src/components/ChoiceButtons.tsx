import React from 'react';
import { ShoppingCart, Wallet, TrendingUp } from 'lucide-react';

interface ChoiceButtonsProps {
  options: {
    spend: string;
    save: string;
    invest: string;
  };
  onChoice: (choice: 'spend' | 'save' | 'invest') => void;
  disabled: boolean;
}

export const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({ options, onChoice, disabled }) => {
  const choices = [
    {
      type: 'spend' as const,
      label: '🛍️ Spend',
      description: options.spend,
      icon: ShoppingCart,
      color: 'bg-red-500 hover:bg-red-600',
      zone: '🔴 Red Zone',
      emoji: '💸'
    },
    {
      type: 'save' as const,
      label: '🏦 Save',
      description: options.save,
      icon: Wallet,
      color: 'bg-blue-500 hover:bg-blue-600',
      zone: '🔵 Blue Zone',
      emoji: '🐷'
    },
    {
      type: 'invest' as const,
      label: '📈 Invest',
      description: options.invest,
      icon: TrendingUp,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      zone: '🟡 Yellow Zone',
      emoji: '🌱'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {choices.map((choice) => {
        const Icon = choice.icon;
        return (
          <button
            key={choice.type}
            onClick={() => onChoice(choice.type)}
            disabled={disabled}
            className={`${choice.color} text-white p-8 rounded-2xl shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-4 border-white`}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="text-5xl mb-2">{choice.emoji}</div>
              <h3 className="text-2xl font-black mb-2">{choice.label}</h3>
              <p className="text-sm font-semibold opacity-90 mb-2">{choice.zone}</p>
              <p className="text-base leading-relaxed">{choice.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};