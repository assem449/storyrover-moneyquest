import React from 'react';
import { Smile, Frown, Meh, Sparkles, X } from 'lucide-react';

interface ConsequenceModalProps {
  consequence: {
    result: string;
    balanceChange: number;
    lesson: string;
    emotion: 'happy' | 'sad' | 'neutral' | 'excited';
  } | null;
  onClose: () => void;
}

export const ConsequenceModal: React.FC<ConsequenceModalProps> = ({ consequence, onClose }) => {
  if (!consequence) return null;

  const emotionConfig = {
    happy: { icon: Smile, color: 'text-green-500', bg: 'bg-green-50' },
    sad: { icon: Frown, color: 'text-red-500', bg: 'bg-red-50' },
    neutral: { icon: Meh, color: 'text-blue-500', bg: 'bg-blue-50' },
    excited: { icon: Sparkles, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  };

  const config = emotionConfig[consequence.emotion];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl animate-bounce-in">
        <div className={`${config.bg} p-8 rounded-t-3xl relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          >
            <X size={24} />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <Icon className={config.color} size={80} />
            <h2 className="text-3xl font-bold text-gray-900 mt-4">
              {consequence.balanceChange > 0 ? 'Great Job!' : 
               consequence.balanceChange < 0 ? 'Learning Moment' : 
               'Good Choice!'}
            </h2>
          </div>
        </div>
        
        <div className="p-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">What Happened:</h3>
            <p className="text-gray-800 text-lg leading-relaxed">
              {consequence.result}
            </p>
          </div>
          
          <div className="bg-wealthsimple-gold bg-opacity-20 p-6 rounded-2xl mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              💡 Money Lesson:
            </h3>
            <p className="text-gray-800 font-medium">
              {consequence.lesson}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-wealthsimple-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors"
          >
            Continue Adventure
          </button>
        </div>
      </div>
    </div>
  );
};
