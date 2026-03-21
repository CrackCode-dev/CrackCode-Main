import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../../context/userauth/authenticationContext';
import { useTheme } from '../../context/theme/ThemeContext';
import Avatar from '../common/Avatar';
import CircularProgress from './CircularProgress';
import { ChevronRight, Lock } from 'lucide-react';
import { fetchBadgeProgress } from '../../services/api/badgeService';

function ProfileCard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { userData, isLoggedIn } = useContext(AppContent);
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const [badges, setBadges] = useState([]);
  const [badgesLoading, setBadgesLoading] = useState(true);

  // Fetch badges from server
  useEffect(() => {
    const loadBadges = async () => {
      if (!isLoggedIn) {
        setBadgesLoading(false);
        return;
      }

      try {
        const badgesData = await fetchBadgeProgress();
        setBadges(badgesData || []);
      } catch (error) {
        console.error('Failed to load badges:', error);
        setBadges([]);
      } finally {
        setBadgesLoading(false);
      }
    };

    loadBadges();
  }, [isLoggedIn]);

  // Listen for question submission events to refresh badges on profile card
  useEffect(() => {
    if (!isLoggedIn) return;

    const handleSolutionSubmitted = async (event) => {
      console.log('🏆 Solution submitted - refreshing profile badges...', event.detail);
      try {
        const badgesData = await fetchBadgeProgress();
        setBadges(badgesData || []);
        console.log('✅ Profile badges refreshed');
      } catch (error) {
        console.error('❌ Failed to refresh badges:', error);
      }
    };

    // Add event listener using standard event name (lowercase, no 'on' prefix)
    window.addEventListener('solutionSubmitted', handleSolutionSubmitted);

    // Cleanup: remove event listener when component unmounts
    return () => {
      window.removeEventListener('solutionSubmitted', handleSolutionSubmitted);
    };
  }, [isLoggedIn]);

  // Mock data for testing when not logged in
  const mockUserData = {
    name: 'John Doe',
    email: 'john@example.com',
    level: 24,
    avatar: null
  };

  // Use real user data if logged in, otherwise mock data
  const currentUser = userData && isLoggedIn ? userData : mockUserData;

  // Get stats from userData - now includes totalXP, tokens, rank from backend
  const totalXP = currentUser?.totalXP || 0;
  const xpForCurrentLevel = totalXP % 100; // XP within current level
  const maxXpPerLevel = 100;
  
  const stats = {
    xp: xpForCurrentLevel,
    xpMax: maxXpPerLevel,
    tokens: currentUser?.tokens || 0,
    tokensMax: currentUser?.tokensMax || 2000,
    casesSolved: currentUser?.casesSolved || 0,
    caseSolvedMax: 100,
    rankTier: currentUser?.rank || "Rookie" // Rank tier like "Rookie", "Pro", etc
  };

  const handleProfileClick = () => {
    navigate('/user-profile');
  };

  const questionsCompleted = userData?.casesSolved || 0;

  return (
    <div
      onClick={handleProfileClick}
      className='cursor-pointer rounded-lg transition-all duration-300 flex flex-col'
      style={{
        background: 'var(--surface)',
        color: 'var(--text)',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transform: 'scale(1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(255, 165, 0, 0.15)';
        e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* User Header Section */}
      <div className='p-6 pb-4 border-b' style={{ borderColor: 'var(--border)' }}>
        {/* User Info */}
        <div className='flex items-start justify-between mb-6'>
          <div className='flex items-center gap-3 flex-1 min-w-0'>
            <div className='w-16 h-16 rounded-full overflow-hidden border-3 shrink-0 transition-all duration-300' 
              style={{ borderColor: 'var(--brand)' }}
            >
              <Avatar showClick={false} className='w-full h-full' />
            </div>
            <div className='min-w-0 flex-1'>
              <h3 className='font-bold text-sm truncate'>{currentUser?.username || currentUser?.name || 'Detective'}</h3>
              <p className='text-xs truncate' style={{ color: 'var(--textSec)' }}>
                Level {Math.floor(totalXP / 100)}
              </p>
              <p className='text-xs truncate' style={{ color: 'var(--textSec)' }}>
                {questionsCompleted} cases solved
              </p>
            </div>
          </div>
          <ChevronRight className='w-4 h-4 shrink-0 transition-transform duration-300' style={{ color: 'var(--brand)' }} />
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-3 gap-2'>
          {/* XP Progress */}
          <div className='flex flex-col items-center transition-transform duration-300 hover:scale-110'>
            <CircularProgress
              value={stats.xp}
              max={stats.xpMax}
              size={50}
              stroke={2}
              color='var(--brand)'
              trackColor='rgba(255, 165, 0, 0.1)'
              label='XP'
              sublabel={`${Math.round((stats.xp / stats.xpMax) * 100)}%`}
            />
          </div>

          {/* Tokens Progress */}
          <div className='flex flex-col items-center transition-transform duration-300 hover:scale-110'>
            <CircularProgress
              value={stats.tokens}
              max={stats.tokensMax}
              size={50}
              stroke={2}
              color='var(--brand)'
              trackColor='rgba(255, 165, 0, 0.1)'
              label='Tokens'
              sublabel={`${Math.round((stats.tokens / stats.tokensMax) * 100)}%`}
            />
          </div>

          {/* Rank/Cases Solved Progress */}
          <div className='flex flex-col items-center transition-transform duration-300 hover:scale-110'>
            <CircularProgress
              value={stats.casesSolved}
              max={stats.caseSolvedMax}
              size={50}
              stroke={2}
              color='var(--brand)'
              trackColor='rgba(255, 165, 0, 0.1)'
              label={stats.rankTier}
              sublabel={`${stats.casesSolved} cases`}
            />
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className='px-6 py-5 pb-4 flex-1 flex flex-col overflow-visible'>
        <div className='flex items-center justify-between mb-4'>
          <h4 className='text-sm font-bold'>Badges</h4>
          <span className='text-xs px-2 py-1 rounded' style={{ background: 'rgba(255, 165, 0, 0.15)', color: 'var(--brand)' }}>
            {badgesLoading ? '...' : `${badges.filter(b => b.isUnlocked).length}/${badges.length}`}
          </span>
        </div>

        {/* Badges Grid - with space for tooltip */}
        <div className='grid gap-2 relative' style={{ padding: '12px 4px 20px 4px', gridTemplateColumns: `repeat(${Math.min(5, badges.length)}, minmax(0, 1fr))` }}>
          {badgesLoading ? (
            <div className='col-span-full flex items-center justify-center py-8'>
              <p className='text-xs' style={{ color: 'var(--textSec)' }}>Loading badges...</p>
            </div>
          ) : badges.length === 0 ? (
            <div className='col-span-full flex items-center justify-center py-8'>
              <p className='text-xs' style={{ color: 'var(--textSec)' }}>No badges available</p>
            </div>
          ) : (
            badges.map((badge, index) => {
            // Determine tooltip position based on badge position in grid
            const isLeftColumn = index % 4 === 0;
            const isRightColumn = index % 4 === 3;
            const isCenterColumns = !isLeftColumn && !isRightColumn;
            const isTopRow = index < 4;
            const isBottomRow = index >= 4;
            
            let tooltipPositioning = {
              position: 'absolute',
              zIndex: 50,
              minWidth: 'max-content',
              maxWidth: '140px',
              whiteSpace: 'normal',
              pointerEvents: 'none'
            };

            // Vertical positioning: Show below normally, above if bottom row
            if (isBottomRow) {
              tooltipPositioning.bottom = 'calc(100% + 8px)';
            } else {
              tooltipPositioning.top = 'calc(100% + 8px)';
            }

            // Horizontal positioning: Center normally, adjust for edges
            if (isLeftColumn) {
              tooltipPositioning.left = 'calc(-70px + 50%)';
            } else if (isRightColumn) {
              tooltipPositioning.right = 'calc(-70px + 50%)';
            } else {
              tooltipPositioning.left = '50%';
              tooltipPositioning.transform = 'translateX(-50%)';
            }

            return (
            <div
              key={badge.id}
              onMouseEnter={() => setHoveredBadge(badge.id)}
              onMouseLeave={() => setHoveredBadge(null)}
              className='relative group cursor-pointer transition-all duration-300'
              style={{
                opacity: badge.isUnlocked ? 1 : 0.3,
                zIndex: hoveredBadge === badge.id ? 50 : 0
              }}
            >
              {/* Badge Container */}
              <div
                className='relative aspect-square rounded-lg flex items-center justify-center transition-all duration-300'
                style={{
                  background: badge.isUnlocked 
                    ? `${badge.color}25` 
                    : 'rgba(128, 128, 128, 0.15)',
                  border: hoveredBadge === badge.id 
                    ? `2px solid ${badge.color}`
                    : badge.isUnlocked
                    ? `1px solid ${badge.color}60`
                    : '1px solid rgba(128, 128, 128, 0.4)',
                  boxShadow: hoveredBadge === badge.id 
                    ? `0 4px 12px ${badge.color}30`
                    : 'none',
                  transform: hoveredBadge === badge.id 
                    ? 'scale(1.1) translateY(-2px)'
                    : 'scale(1)'
                }}
              >
                {/* Badge Icon */}
                <div
                  className='text-2xl transition-transform duration-300'
                  style={{
                    filter: badge.isUnlocked ? 'grayscale(0)' : 'grayscale(1) brightness(0.7)'
                  }}
                >
                  {badge.icon}
                </div>

                {/* Lock Icon for Locked Badges - More Prominent */}
                {!badge.isUnlocked && (
                  <div className='absolute inset-0 flex items-center justify-center rounded-lg transition-all duration-300' style={{ background: badge.isUnlocked ? 'transparent' : 'rgba(0, 0, 0, 0.4)' }}>
                    <Lock className='w-4 h-4 transition-transform duration-300' style={{ color: '#fff', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }} />
                  </div>
                )}

                {/* Progress Ring for Nearly Unlocked */}
                {!badge.isUnlocked && badge.progress > 0 && badge.progress < 100 && (
                  <div className='absolute inset-0 rounded-lg' style={{
                    background: `conic-gradient(var(--brand) 0deg ${(badge.progress / 100) * 360}deg, transparent ${(badge.progress / 100) * 360}deg)`
                  }} />
                )}
              </div>

              {/* Hover Tooltip - Positioned to avoid clipping */}
              {hoveredBadge === badge.id && (
                <div
                  className='absolute p-3 rounded-lg text-xs z-50 pointer-events-none transition-all duration-200'
                  style={{
                    background: 'rgba(0, 0, 0, 0.95)',
                    color: '#fff',
                    animation: 'fadeIn 0.2s',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 165, 0, 0.3)',
                    ...tooltipPositioning,
                    minWidth: 'max-content',
                    maxWidth: '160px',
                    whiteSpace: 'normal',
                    lineHeight: '1.3'
                  }}
                >
                  <div className='font-bold'>{badge.name}</div>
                  <div className='text-xs opacity-80 mt-1'>{badge.description}</div>
                  {!badge.isUnlocked && (
                    <div className='text-xs opacity-60 mt-1'>
                      {Math.round(badge.progress)}% complete
                    </div>
                  )}
                </div>
              )}
            </div>
            );
          })
          )}
        </div>

        {/* Badge Info */}
        <div className='mt-4 p-3 rounded-lg text-xs' style={{ background: 'rgba(255, 165, 0, 0.08)', color: 'var(--textSec)' }}>
          <p>
            {questionsCompleted === 0 
              ? '🎯 Solve your first challenge to unlock badges!' 
              : `✨ ${Math.max(0, badges.length - badges.filter(b => b.isUnlocked).length)} badges remaining. Keep solving!`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
