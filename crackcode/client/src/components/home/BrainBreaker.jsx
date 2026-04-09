import { useState } from 'react';
import { Zap, X, ExternalLink } from 'lucide-react';

const GAMES = [
  {
    id: 'binary-bitz',
    name: 'Binary-Bitz',
    description: 'Master number systems! Learn decimal, hexadecimal, binary and more. Challenge yourself with fun interactive puzzles.',
    icon: '🔢',
    color: '#FF6B6B',
    url: 'https://crackcodegames.vercel.app'
  },
  {
    id: 'wordhunt',
    name: 'WordHunt',
    description: 'A word puzzle game like Wordle! Fill in related terms and words. Test your vocabulary and deduction skills.',
    icon: '📝',
    color: '#4ECDC4',
    url: 'https://wordhunt-beta.vercel.app'
  },
  {
    id: 'codedefense',
    name: 'CodeDefense',
    description: 'Protect your server from bugs! Answer programming questions correctly to defend against cyber threats.',
    icon: '🛡️',
    color: '#95E1D3',
    url: 'https://codedefense.vercel.app'
  }
];

export default function BrainBreaker() {
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <>
      <div
        id="brain-breaker"
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
              onClick={() => setSelectedGame(game)}
              className='flex flex-col items-start gap-3 p-5 rounded-lg transition-all duration-300 border-2 hover:shadow-lg h-full text-left'
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
              <div className='flex justify-between items-start w-full'>
                <span className='text-4xl'>{game.icon}</span>
                <ExternalLink size={16} style={{ color: game.color }} />
              </div>
              <div>
                <p className='font-bold text-base'>{game.name}</p>
                <p style={{ color: 'var(--textSec)' }} className='text-sm mt-2'>
                  {game.description}
                </p>
              </div>
              <div
                className='text-xs font-semibold px-3 py-1 rounded-full mt-auto'
                style={{ background: `${game.color}20`, color: game.color }}
              >
                Play Now
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Game Modal with iframe */}
      {selectedGame && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center p-4'
          style={{ background: 'rgba(0, 0, 0, 0.7)' }}
          onClick={() => setSelectedGame(null)}
        >
          <div
            className='relative w-full h-5/6 max-w-5xl rounded-lg overflow-hidden'
            style={{ background: 'var(--surface)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className='flex items-center justify-between p-4 border-b'
              style={{ borderColor: 'var(--border)' }}
            >
              <div className='flex items-center gap-3'>
                <span className='text-2xl'>{selectedGame.icon}</span>
                <div>
                  <h2 className='font-bold text-lg' style={{ color: 'var(--text)' }}>
                    {selectedGame.name}
                  </h2>
                  <p className='text-xs' style={{ color: 'var(--textSec)' }}>
                    {selectedGame.url}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGame(null)}
                className='p-2 rounded-lg transition-all hover:scale-110'
                style={{ background: 'rgba(255, 165, 0, 0.1)', color: 'var(--brand)' }}
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            {/* iframe */}
            <iframe
              src={selectedGame.url}
              title={selectedGame.name}
              className='w-full h-full border-0'
              style={{ height: 'calc(100% - 60px)' }}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            />
          </div>
        </div>
      )}
    </>
  );
}
