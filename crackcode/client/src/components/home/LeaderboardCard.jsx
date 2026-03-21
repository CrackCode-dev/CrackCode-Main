import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/theme/ThemeContext';
import { AppContent } from '../../context/userauth/authenticationContext';
import { Trophy, TrendingUp, ExternalLink, Crown } from 'lucide-react';
import Button from '../ui/Button';
import { getGlobalLeaderboard, getMyRank } from '../../services/api/leaderboardService';

export default function LeaderboardCard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isLoggedIn, backendUrl } = useContext(AppContent);
  const [hoveredRank, setHoveredRank] = useState(null);
  const [topPlayers, setTopPlayers] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard data and user rank
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch top 10 global leaderboard
        const leaderboardData = await getGlobalLeaderboard();
        if (leaderboardData.success && leaderboardData.leaderboard) {
          // Take only top 3 for display in card
          setTopPlayers(leaderboardData.leaderboard.slice(0, 3));
        }

        // Fetch user's rank if logged in
        if (isLoggedIn) {
          try {
            const rankData = await getMyRank();
            if (rankData.success) {
              setUserRank(rankData);
            }
          } catch (error) {
            console.warn('Failed to fetch user rank:', error);
          }
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, backendUrl]);

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
          <span className='text-sm font-semibold'>{userRank?.position ? '+' + (userRank.position > 10 ? '5' : '3') : '0'}</span>
        </div>
      </div>

      {/* Your Rank - Enhanced */}
      {userRank ? (
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
              #{userRank.position}
            </p>
          </div>
          <div className='text-right'>
            <p className='text-xs' style={{ color: 'var(--textSec)' }}>
              {userRank.rank}
            </p>
            <p className='text-lg font-semibold'>
              {userRank.totalXP?.toLocaleString() || 0} XP
            </p>
          </div>
        </div>
      ) : (
        <div
          className='rounded-md p-3 mb-4 border-l-4 flex items-center justify-between transition-all duration-300'
          style={{
            background: 'linear-gradient(135deg, rgba(128, 128, 128, 0.08) 0%, rgba(128, 128, 128, 0.02) 100%)',
            borderLeftColor: 'rgba(128, 128, 128, 0.5)'
          }}
        >
          <div>
            <p className='text-sm' style={{ color: 'var(--textSec)' }}>
              Your Rank
            </p>
            <p className='font-bold text-2xl' style={{ color: 'var(--textSec)' }}>
              Sign in to see
            </p>
          </div>
        </div>
      )}

      {/* Top Players List */}
      <div className='space-y-2'>
        <p className='text-xs font-semibold uppercase' style={{ color: 'var(--textSec)' }}>
          {loading ? 'Loading...' : 'Top Players This Week'}
        </p>
        {loading ? (
          <div className='flex items-center justify-center py-4'>
            <p className='text-sm' style={{ color: 'var(--textSec)' }}>Fetching rankings...</p>
          </div>
        ) : topPlayers.length > 0 ? (
          topPlayers.map((player, index) => (
            <div
              key={player.position || index}
              onMouseEnter={() => setHoveredRank(player.position || index)}
              onMouseLeave={() => setHoveredRank(null)}
              className='flex items-center justify-between p-3 rounded transition-all duration-300 cursor-pointer'
              style={{
                background: hoveredRank === (player.position || index) ? 'rgba(255, 165, 0, 0.08)' : 'rgba(255, 165, 0, 0.02)',
                border: '1px solid var(--border)',
                transform: hoveredRank === (player.position || index) ? 'translateX(4px)' : 'translateX(0)',
                boxShadow: hoveredRank === (player.position || index) ? '0 4px 12px rgba(255, 165, 0, 0.1)' : 'none'
              }}
            >
              <div className='flex items-center gap-2 flex-1 min-w-0'>
                <span
                  className='font-bold w-6 text-center text-lg'
                  style={{
                    color: player.position === 1 ? '#FFD700' : player.position === 2 ? '#C0C0C0' : '#CD7F32'
                  }}
                >
                  {player.position === 1 ? <Crown className='w-5 h-5' /> : `#${player.position}`}
                </span>
                <div className='min-w-0 flex-1'>
                  <p className='text-sm font-semibold truncate'>{player.username || 'Unknown'}</p>
                  <p className='text-xs' style={{ color: 'var(--textSec)' }}>
                    {player.rank || 'Rookie'}
                  </p>
                </div>
              </div>
              <p className='text-sm font-bold ml-2' style={{ color: 'var(--brand)' }}>
                {player.totalXP?.toLocaleString() || 0}
              </p>
            </div>
          ))
        ) : (
          <div className='flex items-center justify-center py-4'>
            <p className='text-sm' style={{ color: 'var(--textSec)' }}>No players found</p>
          </div>
        )}
      </div>

      {/* View Full Leaderboard Button */}
      <Button 
        variant='secondary' 
        size='sm' 
        icon={ExternalLink} 
        iconPosition='right' 
        className='mt-4' 
        fullWidth
        onClick={() => navigate('/leaderboard')}
      >
        View Full Leaderboard
      </Button>
    </div>
  );
}
