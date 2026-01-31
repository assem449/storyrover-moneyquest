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
      label: 'Spend',
      description: options.spend,
      icon: ShoppingCart,
      color: 'bg-zones-spend hover:bg-red-600',
      zone: 'Red Zone'
    },
    {
      type: 'save' as const,
      label: 'Save',
      description: options.save,
      icon: Wallet,
      color: 'bg-zones-save hover:bg-blue-600',
      zone: 'Blue Zone'
    },
    {
      type: 'invest' as const,
      label: 'Invest',
      description: options.invest,
      icon: TrendingUp,
      color: 'bg-zones-invest hover:bg-yellow-600',
      zone: 'Yellow Zone'
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
            className={`${choice.color} text-white p-6 rounded-2xl shadow-xl transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <Icon size={48} className="mb-2" />
              <div>
                <h3 className="text-2xl font-bold mb-2">{choice.label}</h3>
                <p className="text-sm opacity-90 mb-2">{choice.zone}</p>
                <p className="text-sm leading-relaxed">{choice.description}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
