import React from 'react';
import { X } from 'lucide-react';

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
    happy: { icon: '😊', bg: 'bg-green-100', border: 'border-green-400', title: 'Nice Job!' },
    sad: { icon: '😢', bg: 'bg-red-100', border: 'border-red-400', title: 'Oh No!' },
    neutral: { icon: '😐', bg: 'bg-blue-100', border: 'border-blue-400', title: 'Good Choice!' },
    excited: { icon: '🎉', bg: 'bg-yellow-100', border: 'border-yellow-400', title: 'AMAZING!' },
  };

  const config = emotionConfig[consequence.emotion];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-4 ${config.border}`}>
        <div className={`${config.bg} p-8 rounded-t-3xl relative border-b-4 ${config.border}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 bg-white rounded-full p-2 shadow-lg"
          >
            <X size={24} />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-8xl mb-4">{config.icon}</div>
            <h2 className="text-4xl font-black text-gray-900">
              {config.title}
            </h2>
          </div>
        </div>
        
        <div className="p-8">
          <div className="mb-6 bg-gray-50 p-6 rounded-2xl border-2 border-gray-200">
            <h3 className="text-xl font-black text-wealthsimple-black mb-3">
              📖 What Happened:
            </h3>
            <p className="text-gray-800 text-lg leading-relaxed">
              {consequence.result}
            </p>
          </div>
          
          <div className="bg-wealthsimple-gold bg-opacity-30 p-6 rounded-2xl mb-6 border-2 border-wealthsimple-gold">
            <h3 className="text-xl font-black text-wealthsimple-black mb-3">
              💡 Money Lesson:
            </h3>
            <p className="text-gray-900 text-lg font-semibold">
              {consequence.lesson}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-wealthsimple-black hover:bg-gray-800 text-wealthsimple-gold py-4 rounded-xl font-black text-2xl transition-colors shadow-lg"
          >
            NEXT ADVENTURE! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};