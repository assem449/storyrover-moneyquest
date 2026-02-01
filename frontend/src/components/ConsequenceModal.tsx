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
      {/* Changed to max-w-sm (approx 384px) for a much smaller footprint */}
      <div className={`bg-white rounded-2xl max-w-sm w-full shadow-2xl border-2 ${config.border}`}>
        {/* Tightened padding to p-4 */}
        <div className={`${config.bg} p-4 rounded-t-2xl relative border-b-2 ${config.border}`}>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 bg-white rounded-full p-1 shadow-sm"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center gap-3">
            {/* Switched to side-by-side layout to save vertical space */}
            <div className="text-4xl">{config.icon}</div>
            <h2 className="text-xl font-black text-gray-900">
              {config.title}
            </h2>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-1">
              📖 What Happened:
            </h3>
            <p className="text-gray-800 text-sm leading-snug">
              {consequence.result}
            </p>
          </div>
          
          <div className="bg-wealthsimple-gold bg-opacity-20 p-3 rounded-xl border border-yellow-200">
            <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider mb-1">
              💡 Money Lesson:
            </h3>
            <p className="text-gray-900 text-sm font-bold">
              {consequence.lesson}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-wealthsimple-black hover:bg-gray-800 text-wealthsimple-gold py-2 rounded-lg font-black text-lg transition-colors"
          >
            NEXT ADVENTURE! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};