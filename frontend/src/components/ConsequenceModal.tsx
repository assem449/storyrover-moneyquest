import React from 'react';
import { Smile, Frown, Meh, Sparkles, X, PartyPopper } from 'lucide-react';

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
    happy: { icon: '😊', color: 'text-green-600', bg: 'bg-green-100', title: 'Nice Job!' },
    sad: { icon: '😢', color: 'text-red-600', bg: 'bg-red-100', title: 'Oh No!' },
    neutral: { icon: '😐', color: 'text-blue-600', bg: 'bg-blue-100', title: 'Good Choice!' },
    excited: { icon: '🎉', color: 'text-yellow-600', bg: 'bg-yellow-100', title: 'AMAZING!' },
  };

  const config = emotionConfig[consequence.emotion];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl animate-bounce-in border-8 border-purple-400">
        <div className={`${config.bg} p-10 rounded-t-3xl relative border-b-8 border-purple-400`}>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-700 hover:text-gray-900 bg-white rounded-full p-2 shadow-lg"
          >
            <X size={32} />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-9xl mb-4 animate-bounce">{config.icon}</div>
            <h2 className="text-5xl font-black text-gray-900">
              {config.title}
            </h2>
            {consequence.balanceChange > 0 && (
              <div className="text-6xl mt-4">💰💸✨</div>
            )}
          </div>
        </div>
        
        <div className="p-10">
          <div className="mb-8 bg-purple-50 p-8 rounded-3xl border-4 border-purple-200">
            <h3 className="text-2xl font-black text-purple-600 mb-4 flex items-center gap-2">
              📖 What Happened:
            </h3>
            <p className="text-gray-900 text-2xl leading-relaxed font-semibold">
              {consequence.result}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-8 rounded-3xl mb-8 border-4 border-yellow-400">
            <h3 className="text-2xl font-black text-orange-700 mb-4 flex items-center gap-2">
              💡 Money Lesson:
            </h3>
            <p className="text-gray-900 text-xl font-bold">
              {consequence.lesson}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 rounded-2xl font-black text-3xl transition-all transform hover:scale-105 active:scale-95 shadow-xl border-4 border-white"
          >
            NEXT ADVENTURE! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};