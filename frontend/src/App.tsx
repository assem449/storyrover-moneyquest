import React, { useState } from 'react';
import { Play, RotateCcw, Wifi, WifiOff } from 'lucide-react';
import { adventureAPI, hardwareAPI, Scenario, Consequence } from './services/api';
import { BalanceDisplay } from './components/BalanceDisplay';
import { ScenarioCard } from './components/ScenarioCard';
import { ChoiceButtons } from './components/ChoiceButtons';
import { ConsequenceModal } from './components/ConsequenceModal';
import { LoadingSpinner } from './components/LoadingSpinner';

type GameState = 'idle' | 'playing' | 'loading' | 'consequence';

function App() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [consequence, setConsequence] = useState<Consequence | null>(null);
  const [balance, setBalance] = useState(10);
  const [round, setRound] = useState(0);
  const [lastChange, setLastChange] = useState<number | undefined>(undefined);
  const [hardwareConnected, setHardwareConnected] = useState<boolean | null>(null);

  const checkHardwareConnection = async () => {
    try {
      const result = await hardwareAPI.testConnection();
      setHardwareConnected(result.connected);
    } catch {
      setHardwareConnected(false);
    }
  };

  React.useEffect(() => {
    checkHardwareConnection();
  }, []);

  const startAdventure = async () => {
    setGameState('loading');
    try {
      const response = await adventureAPI.startAdventure(10);
      setScenario(response.scenario || null);
      setBalance(response.balance);
      setRound(response.round);
      setLastChange(undefined);
      setGameState('playing');
    } catch (error) {
      console.error('Failed to start adventure:', error);
      alert('Failed to start adventure. Make sure the backend is running!');
      setGameState('idle');
    }
  };

  const makeChoice = async (choice: 'spend' | 'save' | 'invest') => {
    setGameState('loading');
    try {
      const response = await adventureAPI.makeChoice(choice);
      
      if (response.consequence) {
        setConsequence(response.consequence);
        setLastChange(response.consequence.balanceChange);
        setBalance(response.balance);
        setRound(response.round);
        setGameState('consequence');
        
        // Preload next scenario
        if (response.nextScenario) {
          setScenario(response.nextScenario);
        }
      }
    } catch (error) {
      console.error('Failed to make choice:', error);
      alert('Failed to process choice. Please try again!');
      setGameState('playing');
    }
  };

  const closeConsequence = () => {
    setConsequence(null);
    setGameState('playing');
  };

  const resetGame = async () => {
    if (confirm('Are you sure you want to start over?')) {
      setGameState('loading');
      try {
        await adventureAPI.reset();
        setGameState('idle');
        setScenario(null);
        setConsequence(null);
        setBalance(10);
        setRound(0);
        setLastChange(undefined);
      } catch (error) {
        console.error('Failed to reset:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-wealthsimple-black text-white shadow-2xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                StoryRover: Money Quest
              </h1>
              <p className="text-gray-300 mt-2">
                Learn about money through interactive adventures!
              </p>
            </div>
            <div className="flex items-center gap-4">
              {hardwareConnected !== null && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  hardwareConnected ? 'bg-green-600' : 'bg-red-600'
                }`}>
                  {hardwareConnected ? <Wifi size={20} /> : <WifiOff size={20} />}
                  <span className="text-sm font-medium">
                    {hardwareConnected ? 'Robot Connected' : 'Robot Offline'}
                  </span>
                </div>
              )}
              {gameState !== 'idle' && (
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <RotateCcw size={20} />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {gameState === 'idle' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl p-12 shadow-2xl">
              <div className="text-8xl mb-6">🚀</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Ready for an Adventure?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Make smart money choices and watch your robot friend bring your story to life!
              </p>
              <button
                onClick={startAdventure}
                className="bg-wealthsimple-gold hover:bg-yellow-500 text-wealthsimple-black font-bold text-2xl px-12 py-6 rounded-2xl shadow-xl transform transition-all hover:scale-105 flex items-center gap-3 mx-auto"
              >
                <Play size={32} />
                Start New Adventure
              </button>
            </div>
          </div>
        )}

        {gameState === 'loading' && (
          <LoadingSpinner message="The robot is thinking..." />
        )}

        {(gameState === 'playing' || gameState === 'consequence') && scenario && (
          <div className="space-y-8">
            {/* Balance Display */}
            <BalanceDisplay balance={balance} lastChange={lastChange} round={round} />

            {/* Scenario */}
            <ScenarioCard scenario={scenario.scenario} />

            {/* Choice Buttons */}
            <ChoiceButtons
              options={scenario.options}
              onChoice={makeChoice}
              disabled={gameState === 'consequence'}
            />

            {/* Zone Legend */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                🎯 Robot Zones on the Floor:
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-zones-spend rounded"></div>
                  <span className="font-medium">Red = Spend</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-zones-save rounded"></div>
                  <span className="font-medium">Blue = Save</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-zones-invest rounded"></div>
                  <span className="font-medium">Yellow = Invest</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Consequence Modal */}
      {consequence && (
        <ConsequenceModal consequence={consequence} onClose={closeConsequence} />
      )}

      {/* Footer */}
      <footer className="bg-wealthsimple-black text-white py-6 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            Built with 💛 for Wealthsimple Challenge | Powered by Gemini AI & ElevenLabs
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
