import { createContext, useState, useEffect } from 'react';

export const UserProgressContext = createContext();

export const UserProgressProvider = (props) => {
  // Session-based progress tracking (resets on page refresh)
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState(['beginner']); // 'beginner' badge always unlocked

  // Define all 8 badges
  const BADGES = [
    {
      id: 'beginner',
      name: 'Beginner Detective',
      description: 'Complete your first Crack Code challenge',
      icon: '🔍',
      color: '#95E1D3',
      unlockedAt: 0
    },
    {
      id: 'solver',
      name: 'Challenge Solver',
      description: 'Complete 5 challenges',
      icon: '🎯',
      color: '#FFE66D',
      unlockedAt: 5
    },
    {
      id: 'speedster',
      name: 'Speedster',
      description: 'Solve a challenge in under 3 minutes',
      icon: '⚡',
      color: '#FF6B6B',
      unlockedAt: 1
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Solve a challenge on first try',
      icon: '✨',
      color: '#A8E6CF',
      unlockedAt: 1
    },
    {
      id: 'streak',
      name: 'On Fire!',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      color: '#FFB347',
      unlockedAt: 7
    },
    {
      id: 'leaderboard',
      name: 'Leaderboard Climber',
      description: 'Reach top 100 on leaderboard',
      icon: '📈',
      color: '#87CEEB',
      unlockedAt: 1
    },
    {
      id: 'arrays_master',
      name: 'Arrays Master',
      description: 'Complete all array challenges',
      icon: '📚',
      color: '#DDA0DD',
      unlockedAt: 1
    },
    {
      id: 'algorithm_pro',
      name: 'Algorithm Pro',
      description: 'Solve 20 challenges',
      icon: '🚀',
      color: '#FFD700',
      unlockedAt: 20
    }
  ];

  // Simulate completing a question
  const completeQuestion = (metadata = {}) => {
    setQuestionsCompleted(prev => {
      const newCount = prev + 1;
      
      // Auto-unlock badges based on completion count
      if (newCount === 1) {
        setUnlockedBadges(prev => [...new Set([...prev, 'beginner', 'speedster', 'perfectionist', 'leaderboard', 'arrays_master'])]);
      } else if (newCount === 5) {
        setUnlockedBadges(prev => [...new Set([...prev, 'solver'])]);
      } else if (newCount === 20) {
        setUnlockedBadges(prev => [...new Set([...prev, 'algorithm_pro'])]);
      }
      
      return newCount;
    });
  };

  // Check if badge is unlocked
  const isBadgeUnlocked = (badgeId) => {
    return unlockedBadges.includes(badgeId);
  };

  // Get badge details
  const getBadge = (badgeId) => {
    return BADGES.find(b => b.id === badgeId);
  };

  // Get progress for all badges
  const getBadgesProgress = () => {
    return BADGES.map(badge => ({
      ...badge,
      isUnlocked: isBadgeUnlocked(badge.id),
      progress: Math.min((questionsCompleted / badge.unlockedAt) * 100, 100)
    }));
  };

  const value = {
    questionsCompleted,
    completeQuestion,
    unlockedBadges,
    BADGES,
    isBadgeUnlocked,
    getBadge,
    getBadgesProgress
  };

  return (
    <UserProgressContext.Provider value={value}>
      {props.children}
    </UserProgressContext.Provider>
  );
};
