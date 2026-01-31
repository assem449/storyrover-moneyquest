import React, { useState } from 'react';
import { Play, RotateCcw, Wifi, WifiOff } from 'lucide-react';
import { adventureAPI, hardwareAPI, Scenario, Consequence } from './services/api';
import { BalanceDisplay } from './components/BalanceDisplay';
import { ScenarioCard } from './components/ScenarioCard';
import { ChoiceButtons } from './components/ChoiceButtons';
import { ConsequenceModal } from './components/ConsequenceModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import confetti from 'canvas-confetti';

type GameState = 'idle' | 'playing' | 'loading' | 'consequence';

// Add sound effects!
const playSound = (type: 'success' | 'failure' | 'neutral' | 'click') => {
  const sounds = {
    success: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
    failure: 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3',
    neutral: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'
  };
  
  const audio = new Audio(sounds[type]);
  audio.volume = 0.3;
  audio.play().catch(() => {}); // Ignore errors if sound blocked
};

const testConfetti = () => {
  // Simple confetti
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
  
  // Wait then do more!
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
  }, 200);
  
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });
  }, 400);
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
        
        // Play sound based on outcome
        if (response.consequence.balanceChange > 0) {
          playSound('success');
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } else if (response.consequence.balanceChange < 0) {
          playSound('failure');
        } else {
          playSound('neutral');
        }
        
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
      {/* Header with fun colors */}
      <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 text-white shadow-2xl">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-black flex items-center gap-3">
                <span className="text-6xl">🤖💰</span>
                Money Adventure!
              </h1>
              <p className="text-yellow-200 mt-3 text-xl font-bold">
                Learn about money by playing! 🎮✨
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* TEST BUTTON - Remove this after testing! */}
              <button
                onClick={testConfetti}
                className="bg-yellow-400 text-purple-900 px-4 py-2 rounded-lg font-bold"
              >
                🎉 Test Confetti
              </button>
              {hardwareConnected !== null && (
                <div className={`flex items-center gap-2 px-5 py-3 rounded-full text-lg font-bold ${
                  hardwareConnected ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {hardwareConnected ? <Wifi size={24} /> : <WifiOff size={24} />}
                  <span>
                    {hardwareConnected ? '🤖 Robot Ready!' : '🤖 Robot Offline'}
                  </span>
                </div>
              )}
              {gameState !== 'idle' && (
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 bg-white text-purple-600 hover:bg-yellow-200 px-5 py-3 rounded-full transition-colors font-bold text-lg shadow-lg"
                >
                  <RotateCcw size={24} />
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
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white rounded-3xl p-16 shadow-2xl border-8 border-yellow-400">
              <div className="text-9xl mb-8 animate-bounce">🚀💸</div>
              <h2 className="text-5xl font-black text-purple-600 mb-6">
                Ready for a Money Adventure?
              </h2>
              <p className="text-2xl text-gray-700 mb-10 font-semibold">
                Make smart choices and watch your money grow! 🌱💰
              </p>
              <button
                onClick={startAdventure}
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-black text-3xl px-16 py-8 rounded-full shadow-2xl transform transition-all hover:scale-110 active:scale-95 flex items-center gap-4 mx-auto border-4 border-white"
              >
                <Play size={40} />
                START ADVENTURE!
              </button>
            </div>
          </div>
        )}

        {gameState === 'loading' && (
          <div className="bg-white rounded-3xl p-12 shadow-2xl border-8 border-purple-400">
            <LoadingSpinner message="The robot is thinking... 🤔💭" />
          </div>
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

            {/* Zone Legend with emojis */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-yellow-400">
              <h3 className="text-2xl font-black text-purple-600 mb-6 text-center">
                🎯 Where Will The Robot Go?
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="flex flex-col items-center gap-3 p-4 bg-red-100 rounded-2xl">
                  <div className="text-5xl">🔴</div>
                  <span className="font-black text-xl">Spend Zone</span>
                  <span className="text-4xl">💸</span>
                </div>
                <div className="flex flex-col items-center gap-3 p-4 bg-blue-100 rounded-2xl">
                  <div className="text-5xl">🔵</div>
                  <span className="font-black text-xl">Save Zone</span>
                  <span className="text-4xl">🐷</span>
                </div>
                <div className="flex flex-col items-center gap-3 p-4 bg-yellow-100 rounded-2xl">
                  <div className="text-5xl">🟡</div>
                  <span className="font-black text-xl">Invest Zone</span>
                  <span className="text-4xl">🌱</span>
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
      <footer className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-yellow-200 text-xl font-bold">
            🌟 Built with 💛 for Young Money Learners! 🌟
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;