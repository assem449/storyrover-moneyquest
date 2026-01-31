import React, { useState } from 'react';
import { Play, RotateCcw, Wifi, WifiOff } from 'lucide-react';
import confetti from 'canvas-confetti';
import { adventureAPI, hardwareAPI, Scenario, Consequence } from './services/api';
import { BalanceDisplay } from './components/BalanceDisplay';
import { ScenarioCard } from './components/ScenarioCard';
import { ChoiceButtons } from './components/ChoiceButtons';
import { ConsequenceModal } from './components/ConsequenceModal';
import { LoadingSpinner } from './components/LoadingSpinner';

type GameState = 'idle' | 'playing' | 'loading' | 'consequence';

const playSound = (type: 'success' | 'failure' | 'neutral' | 'click') => {
  const sounds = {
    success: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
    failure: 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3',
    neutral: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'
  };
  
  const audio = new Audio(sounds[type]);
  audio.volume = 0.3;
  audio.play().catch(() => {});
};

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
    playSound('click');
    setGameState('loading');
    try {
      const response = await adventureAPI.startAdventure(10);
      setScenario(response.scenario || null);
      setBalance(response.balance);
      setRound(response.round);
      setLastChange(undefined);
      setGameState('playing');
      playSound('success');
    } catch (error) {
      console.error('Failed to start adventure:', error);
      alert('Failed to start adventure. Make sure the backend is running!');
      setGameState('idle');
    }
  };

  const makeChoice = async (choice: 'spend' | 'save' | 'invest') => {
    playSound('click');
    setGameState('loading');
    try {
      const response = await adventureAPI.makeChoice(choice);
      
      if (response.consequence) {
        setConsequence(response.consequence);
        setLastChange(response.consequence.balanceChange);
        setBalance(response.balance);
        setRound(response.round);
        setGameState('consequence');
        
        if (response.consequence.balanceChange > 0) {
          playSound('success');
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FF6347', '#32CD32']
          });
          
          if (response.consequence.balanceChange >= 5) {
            setTimeout(() => {
              confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#FF69B4', '#00CED1']
              });
            }, 200);
          }
        } else if (response.consequence.balanceChange < 0) {
          playSound('failure');
        } else {
          playSound('neutral');
        }
        
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
    playSound('click');
    setConsequence(null);
    setGameState('playing');
  };

  const resetGame = async () => {
    if (confirm('Are you sure you want to start over?')) {
      playSound('click');
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
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header - Wealthsimple Colors */}
      <header className="bg-wealthsimple-black text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black flex items-center gap-3">
                <span className="text-5xl">🤖</span>
                Money Adventure
              </h1>
              <p className="text-wealthsimple-gold mt-2 text-lg font-semibold">
                Learn about money by playing! 🎮
              </p>
            </div>
            <div className="flex items-center gap-4">
              {hardwareConnected !== null && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${
                  hardwareConnected ? 'bg-green-600' : 'bg-gray-700'
                }`}>
                  {hardwareConnected ? <Wifi size={20} /> : <WifiOff size={20} />}
                  <span>
                    {hardwareConnected ? 'Robot Ready' : 'Robot Offline'}
                  </span>
                </div>
              )}
              {gameState !== 'idle' && (
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 bg-wealthsimple-gold text-wealthsimple-black hover:bg-yellow-500 px-4 py-2 rounded-lg transition-colors font-bold shadow-lg"
                >
                  <RotateCcw size={20} />
                  Start Over
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
            <div className="bg-white rounded-3xl p-12 shadow-xl border-4 border-wealthsimple-gold">
              <div className="text-8xl mb-6">🚀💰</div>
              <h2 className="text-4xl font-black text-wealthsimple-black mb-4">
                Ready for a Money Adventure?
              </h2>
              <p className="text-xl text-gray-700 mb-8 font-semibold">
                Make smart choices and watch your money grow! 🌱
              </p>
              <button
                onClick={startAdventure}
                className="bg-wealthsimple-gold hover:bg-yellow-500 text-wealthsimple-black font-black text-2xl px-12 py-6 rounded-2xl shadow-xl transform transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
              >
                <Play size={32} />
                START ADVENTURE!
              </button>
            </div>
          </div>
        )}

        {gameState === 'loading' && (
          <div className="bg-white rounded-3xl p-12 shadow-xl border-4 border-wealthsimple-gold">
            <LoadingSpinner message="The robot is thinking... 🤔" />
          </div>
        )}

        {(gameState === 'playing' || gameState === 'consequence') && scenario && (
          <div className="space-y-8">
            <BalanceDisplay balance={balance} lastChange={lastChange} round={round} />
            <ScenarioCard scenario={scenario.scenario} />
            <ChoiceButtons
              options={scenario.options}
              onChoice={makeChoice}
              disabled={gameState === 'consequence'}
            />

            {/* Clean Zone Legend */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
              <h3 className="text-xl font-black text-wealthsimple-black mb-4 text-center">
                🎯 Robot Zones
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-2 p-4 bg-red-50 rounded-xl border-2 border-red-200">
                  <div className="text-4xl">🔴</div>
                  <span className="font-bold text-lg">Spend</span>
                  <span className="text-3xl">💸</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <div className="text-4xl">🔵</div>
                  <span className="font-bold text-lg">Save</span>
                  <span className="text-3xl">🐷</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-300">
                  <div className="text-4xl">🟡</div>
                  <span className="font-bold text-lg">Invest</span>
                  <span className="text-3xl">🌱</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {consequence && (
        <ConsequenceModal consequence={consequence} onClose={closeConsequence} />
      )}

      {/* Simple Footer */}
      <footer className="bg-wealthsimple-black text-white py-6 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-wealthsimple-gold text-lg font-semibold">
            Built for Wealthsimple Hackathon 🏆
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;