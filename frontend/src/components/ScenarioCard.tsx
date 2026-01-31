import React from 'react';
import { BookOpen } from 'lucide-react';

interface ScenarioCardProps {
  scenario: string;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border-4 border-wealthsimple-gold">
      <div className="flex items-start gap-4">
        <div className="bg-wealthsimple-gold p-3 rounded-full">
          <BookOpen className="text-wealthsimple-black" size={28} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-wealthsimple-black mb-3">
            Your Story
          </h3>
          <p className="text-gray-800 text-lg leading-relaxed">
            {scenario}
          </p>
        </div>
      </div>
    </div>
  );
};
