import { useState } from 'react';
import { useTheme } from '../../context/theme/ThemeContext';
import { Trophy, TrendingUp, ExternalLink } from 'lucide-react';

export default function LeaderboardCard() {
  const { theme } = useTheme();
  const [hoveredRank, setHoveredRank] = useState(null);

  // Mock leaderboard data - replace with real data from API
  const leaderboardData = {
    userRank: 42,
    totalPlayers: 1250,
    percentile: 96.6,
    weeklyChange: '+5',
    topPlayers: [
      { rank: 1, name: 'Alex Chen', points: 15420, streak: 23 },
      { rank: 2, name: 'Sarah Johnson', points: 14890, streak: 18 },
      { rank: 3, name: 'Mike Wilson', points: 13760, streak: 15 }
    ]
  };

  return (
    <div
      className='rounded-lg p-5 transition-all duration-300'
      style={{
        background: 'var(--surface)',
        color: 'var(--text)',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <Trophy className='w-5 h-5 animate-bounce' style={{ color: 'var(--brand)' }} />
          <h3 className='font-bold text-lg'>Leaderboard</h3>
        </div>
        <div className='flex items-center gap-1 px-2 py-1 rounded' style={{ background: 'rgba(82, 200, 130, 0.15)', color: '#52c882' }}>
          <TrendingUp className='w-4 h-4' />
          <span className='text-sm font-semibold'>{leaderboardData.weeklyChange}</span>
        </div>
      </div>

      {/* Your Rank - Enhanced */}
      <div
        className='rounded-md p-3 mb-4 border-l-4 flex items-center justify-between transition-all duration-300 cursor-pointer hover:shadow-md'
        style={{
          background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.08) 0%, rgba(255, 165, 0, 0.02) 100%)',
          borderLeftColor: 'var(--brand)'
        }}
      >
        <div>
          <p className='text-sm' style={{ color: 'var(--textSec)' }}>
            Your Rank
          </p>
          <p className='font-bold text-2xl' style={{ color: 'var(--brand)' }}>
            #{leaderboardData.userRank}
          </p>
        </div>
        <div className='text-right'>
          <p className='text-xs' style={{ color: 'var(--textSec)' }}>
            Top {leaderboardData.percentile}%
          </p>
          <p className='text-lg font-semibold'>
            {leaderboardData.userRank}/{leaderboardData.totalPlayers}
          </p>
        </div>
      </div>

      {/* Top Players List */}
      <div className='space-y-2'>
        <p className='text-xs font-semibold uppercase' style={{ color: 'var(--textSec)' }}>
          Top Players This Week
        </p>
        {leaderboardData.topPlayers.map((player) => (
          <div
            key={player.rank}
            onMouseEnter={() => setHoveredRank(player.rank)}
            onMouseLeave={() => setHoveredRank(null)}
            className='flex items-center justify-between p-3 rounded transition-all duration-300 cursor-pointer'
            style={{
              background: hoveredRank === player.rank ? 'rgba(255, 165, 0, 0.08)' : 'rgba(255, 165, 0, 0.02)',
              border: '1px solid var(--border)',
              transform: hoveredRank === player.rank ? 'translateX(4px)' : 'translateX(0)',
              boxShadow: hoveredRank === player.rank ? '0 4px 12px rgba(255, 165, 0, 0.1)' : 'none'
            }}
          >
            <div className='flex items-center gap-2 flex-1 min-w-0'>
              <span
                className='font-bold w-6 text-center text-lg'
                style={{
                  color: player.rank === 1 ? '#FFD700' : player.rank === 2 ? '#C0C0C0' : '#CD7F32'
                }}
              >
                {player.rank === 1 ? '👑' : `#${player.rank}`}
              </span>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-semibold truncate'>{player.name}</p>
                <p className='text-xs' style={{ color: 'var(--textSec)' }}>
                  {player.streak} 🔥 streak
                </p>
              </div>
            </div>
            <p className='text-sm font-bold ml-2' style={{ color: 'var(--brand)' }}>
              {player.points}
            </p>
          </div>
        ))}
      </div>

      {/* View Full Leaderboard Link */}
      <button
        className='w-full mt-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:gap-3'
        style={{
          background: 'rgba(255, 165, 0, 0.1)',
          color: 'var(--brand)',
          border: '1px solid var(--brand)'
        }}
        onMouseEnter={(e) => (e.target.style.background = 'var(--brand)', e.target.style.color = 'var(--surface)')}
        onMouseLeave={(e) => (e.target.style.background = 'rgba(255, 165, 0, 0.1)', e.target.style.color = 'var(--brand)')}
      >
        View Full Leaderboard
        <ExternalLink className='w-4 h-4' />
      </button>
    </div>
  );
}
