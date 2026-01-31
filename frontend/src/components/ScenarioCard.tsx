import React from 'react';
import { BookOpen } from 'lucide-react';

interface ScenarioCardProps {
  scenario: string;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border-4 border-wealthsimple-gold">
      <div className="flex items-start gap-4">
        <div className="bg-wealthsimple-gold p-3 rounded-full flex-shrink-0">
          <BookOpen className="text-wealthsimple-black" size={32} />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-black text-wealthsimple-black mb-3">
            Your Story 📖
          </h3>
          <p className="text-gray-800 text-xl leading-relaxed">
            {scenario}
          </p>
        </div>
      </div>
    </div>
  );
};