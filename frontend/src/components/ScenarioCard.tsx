import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

interface ScenarioCardProps {
  scenario: string;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario }) => {
  return (
    <div className="bg-white rounded-3xl p-10 shadow-2xl border-8 border-purple-400 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 text-9xl opacity-10">📖</div>
      <div className="absolute bottom-0 left-0 text-9xl opacity-10">✨</div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-purple-500 p-4 rounded-full">
            <BookOpen className="text-white" size={36} />
          </div>
          <h3 className="text-4xl font-black text-purple-600 flex items-center gap-2">
            Your Story
            <Sparkles className="text-yellow-500" size={32} />
          </h3>
        </div>
        <p className="text-gray-900 text-2xl leading-relaxed font-semibold bg-purple-50 p-6 rounded-2xl border-4 border-purple-200">
          {scenario}
        </p>
      </div>
    </div>
  );
};