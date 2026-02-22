import { useState, useEffect } from 'react';
import { useTheme } from '../../context/theme/ThemeContext';
import { Zap, Trophy, RefreshCw, Volume2, VolumeX } from 'lucide-react';

const GAMES = [
  {
    id: 'memory',
    name: 'Memory Matrix',
    description: 'Remember the pattern and repeat it!',
    icon: '🧠',
    color: '#FF6B6B',
    instruction: 'Watch the sequence and click the tiles in the same order'
  },
  {
    id: 'quickmath',
    name: 'Quick Math',
    description: 'Solve math problems in 30 seconds',
    icon: '🔢',
    color: '#4ECDC4',
    instruction: 'Answer as many math questions as you can'
  },
  {
    id: 'wordchain',
    name: 'Word Chain',
    description: 'Find words quickly',
    icon: '📝',
    color: '#95E1D3',
    instruction: 'Type words that start with the last letter of the previous word'
  }
];

export default function BrainBreaker() {
  const { theme } = useTheme();
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [sound, setSound] = useState(true);

  // Tile indices for memory game (static array, doesn't change)
  const TILES = [0, 1, 2, 3];

  // Game: Memory Matrix
  useEffect(() => {
    let interval;
    if (gameActive && selectedGame?.id === 'memory') {
      if (playerSequence.length === sequence.length && sequence.length > 0) {
        interval = setTimeout(() => {
          const newSequence = [...sequence, Math.floor(Math.random() * 4)];
          setSequence(newSequence);
          setPlayerSequence([]);
          setScore(score + 10);
        }, 500);
      }
    }
    return () => clearInterval(interval);
  }, [playerSequence, sequence, selectedGame, gameActive, score]);

  // Timer for quick games
  useEffect(() => {
    if (!gameActive || selectedGame?.id === 'memory') return;
    
    if (timeLeft === 0) {
      setGameActive(false);
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive, selectedGame]);

  const startGame = (game) => {
    setSelectedGame(game);
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setSequence([Math.floor(Math.random() * 4)]);
    setPlayerSequence([]);
  };

  const handleTileClick = (index) => {
    if (!gameActive || selectedGame?.id !== 'memory') return;
    
    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    if (sound) playSound(index);
    
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setGameActive(false);
      setPlayerSequence([]);
    }
  };

  const playSound = (index) => {
    const frequencies = [261.63, 293.66, 329.63, 349.23];
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    
    oscillator.frequency.value = frequencies[index];
    oscillator.type = 'sine';
    
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const resetGame = () => {
    setGameActive(false);
    setSelectedGame(null);
    setScore(0);
    setTimeLeft(30);
    setSequence([]);
    setPlayerSequence([]);
  };

  if (!selectedGame) {
    return (
      <div
        className='rounded-lg p-8 transition-all duration-300'
        style={{
          background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(255, 165, 0, 0.02) 100%)',
          border: '2px dashed var(--border)',
          color: 'var(--text)'
        }}
      >
        <div className='flex items-center gap-3 mb-6'>
          <Zap className='w-6 h-6' style={{ color: 'var(--brand)' }} />
          <div>
            <h3 className='text-2xl font-bold'>🎮 Brain Breaker</h3>
            <p style={{ color: 'var(--textSec)' }} className='text-sm'>
              Take a quick break with mini-games to refresh your mind!
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => startGame(game)}
              className='flex flex-col items-center gap-3 p-4 rounded-lg transition-all duration-300 border-2 hover:shadow-lg'
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = game.color;
                e.currentTarget.style.boxShadow = `0 8px 24px ${game.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span className='text-4xl'>{game.icon}</span>
              <div className='text-center'>
                <p className='font-bold text-sm'>{game.name}</p>
                <p style={{ color: 'var(--textSec)' }} className='text-xs'>
                  {game.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className='rounded-lg p-8 transition-all duration-300 text-center'
      style={{
        background: `linear-gradient(135deg, ${selectedGame.color}15 0%, ${selectedGame.color}05 100%)`,
        border: `2px solid ${selectedGame.color}40`,
        color: 'var(--text)'
      }}
    >
      <div className='flex items-center justify-between mb-6'>
        <div className='flex-1'>
          <h3 className='text-2xl font-bold'>
            {selectedGame.icon} {selectedGame.name}
          </h3>
          <p style={{ color: 'var(--textSec)' }} className='text-sm mt-1'>
            {selectedGame.instruction}
          </p>
        </div>
        <button
          onClick={resetGame}
          className='p-2 rounded-lg transition-all hover:scale-110'
          style={{ background: 'rgba(255, 165, 0, 0.2)', color: 'var(--brand)' }}
        >
          <RefreshCw className='w-5 h-5' />
        </button>
      </div>

      {selectedGame.id === 'memory' && (
        <div className='flex flex-col items-center gap-6'>
          {/* Score & Sequence Display */}
          <div className='flex gap-8'>
            <div>
              <p className='text-xs uppercase' style={{ color: 'var(--textSec)' }}>
                Score
              </p>
              <p className='text-3xl font-bold' style={{ color: selectedGame.color }}>
                {score}
              </p>
            </div>
            <div>
              <p className='text-xs uppercase' style={{ color: 'var(--textSec)' }}>
                Level
              </p>
              <p className='text-3xl font-bold' style={{ color: selectedGame.color }}>
                {sequence.length}
              </p>
            </div>
          </div>

          {/* Memory Tiles */}
          {gameActive && (
            <div className='grid grid-cols-2 gap-4'>
              {TILES.map((tile) => (
                <button
                  key={tile}
                  onClick={() => handleTileClick(tile)}
                  className='w-20 h-20 rounded-lg transition-all duration-150 font-bold text-white'
                  style={{
                    background:
                      tile === 0
                        ? '#FF6B6B'
                        : tile === 1
                          ? '#4ECDC4'
                          : tile === 2
                            ? '#95E1D3'
                            : '#FFD93D',
                    opacity:
                      sequence.includes(tile) && playerSequence.length < sequence.length
                        ? 0.7
                        : 1,
                    transform:
                      playerSequence[playerSequence.length - 1] === tile
                        ? 'scale(0.9)'
                        : 'scale(1)'
                  }}
                  disabled={!gameActive}
                >
                  {tile + 1}
                </button>
              ))}
            </div>
          )}

          {!gameActive && (
            <div className='text-center'>
              <p className='text-2xl font-bold mb-4' style={{ color: selectedGame.color }}>
                Game Over! 🎉
              </p>
              <p className='text-lg mb-6'>
                Final Score: <span style={{ color: selectedGame.color }}>{score}</span>
              </p>
              <button
                onClick={() => startGame(selectedGame)}
                className='px-6 py-2 rounded-lg font-semibold transition-all'
                style={{
                  background: selectedGame.color,
                  color: 'white'
                }}
              >
                Play Again
              </button>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => setSound(!sound)}
            className='p-2 rounded-lg transition-all'
            style={{ background: 'rgba(255, 165, 0, 0.1)', color: 'var(--brand)' }}
          >
            {sound ? <Volume2 className='w-4 h-4' /> : <VolumeX className='w-4 h-4' />}
          </button>
        </div>
      )}

      {selectedGame.id === 'quickmath' && !gameActive && (
        <div className='text-center py-8'>
          <p className='text-2xl font-bold mb-4' style={{ color: selectedGame.color }}>
            Time's Up! ⏱️
          </p>
          <p className='text-lg mb-6'>
            You got <span style={{ color: selectedGame.color }}>{score}</span> points!
          </p>
          <button
            onClick={() => startGame(selectedGame)}
            className='px-6 py-2 rounded-lg font-semibold transition-all'
            style={{
              background: selectedGame.color,
              color: 'white'
            }}
          >
            Play Again
          </button>
        </div>
      )}

      {selectedGame.id === 'quickmath' && gameActive && (
        <div className='py-8'>
          <div className='text-6xl font-bold mb-8' style={{ color: selectedGame.color }}>
            {timeLeft}s
          </div>
          <div className='text-2xl font-semibold mb-6'>Score: {score}</div>
          <div className='bg-white/10 p-6 rounded-lg text-2xl font-bold'>
            Coming Soon! This game is being implemented.
          </div>
        </div>
      )}
    </div>
  );
}
