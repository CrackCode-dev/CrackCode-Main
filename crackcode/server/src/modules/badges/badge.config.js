

export const BADGE_DEFINITIONS = {
  // Core Achievement Badges
  BEGINNER: {
    id: 'beginner',
    name: 'Beginner Detective',
    description: 'Solve your first challenge',
    icon: '🔍',
    color: '#95E1D3',
    category: 'milestone',
    condition: 'casesSolved >= 1'
  },

  CASES_5: {
    id: 'cases_5',
    name: '5 Cases Solved',
    description: 'Solve 5 code challenges',
    icon: '🎯',
    color: '#FFE66D',
    category: 'milestone',
    condition: 'casesSolved >= 5'
  },

  CASES_10: {
    id: 'cases_10',
    name: '10 Cases Solved',
    description: 'Solve 10 code challenges',
    icon: '⚡',
    color: '#FF6B6B',
    category: 'milestone',
    condition: 'casesSolved >= 10'
  },

  CASES_25: {
    id: 'cases_25',
    name: '25 Cases Solved',
    description: 'Solve 25 code challenges',
    icon: '✨',
    color: '#A8E6CF',
    category: 'milestone',
    condition: 'casesSolved >= 25'
  },

  TOP_3_LEADERBOARD: {
    id: 'top_3_leaderboard',
    name: 'Leaderboard Champion',
    description: 'Reach top 3 on the global leaderboard',
    icon: '🏆',
    color: '#FFD700',
    category: 'ranking',
    condition: 'leaderboardRank <= 3'
  },

  // Career Path Completion Badges
  PYTHON_COMPLETE: {
    id: 'python_complete',
    name: 'Python Master',
    description: 'Complete the entire Python learning path',
    icon: '🐍',
    color: '#3776AB',
    category: 'career',
    condition: 'pythonCareerComplete'
  },

  CPP_COMPLETE: {
    id: 'cpp_complete',
    name: 'C++ Expert',
    description: 'Complete the entire C++ learning path',
    icon: '⚙️',
    color: '#00599C',
    category: 'career',
    condition: 'cppCareerComplete'
  },

  JAVA_COMPLETE: {
    id: 'java_complete',
    name: 'Java Guru',
    description: 'Complete the entire Java learning path',
    icon: '☕',
    color: '#007396',
    category: 'career',
    condition: 'javaCareerComplete'
  },

  JAVASCRIPT_COMPLETE: {
    id: 'javascript_complete',
    name: 'JavaScript Wizard',
    description: 'Complete the entire JavaScript learning path',
    icon: '✨',
    color: '#F7DF1E',
    category: 'career',
    condition: 'javascriptCareerComplete'
  },

  CAREER_MAP_COMPLETE: {
    id: 'career_map_complete',
    name: 'Career Path Master',
    description: 'Complete all career map learning paths',
    icon: '🗺️',
    color: '#9C27B0',
    category: 'career',
    condition: 'allCareersComplete'
  }
};

/*
  Get all badge definitions as array
 */
export const getAllBadges = () => {
  return Object.values(BADGE_DEFINITIONS);
};

/*
  Get badge by ID
 */
export const getBadgeById = (badgeId) => {
  return BADGE_DEFINITIONS[Object.keys(BADGE_DEFINITIONS).find(key => BADGE_DEFINITIONS[key].id === badgeId)];
};

/*
  Get badges by category
 */
export const getBadgesByCategory = (category) => {
  return getAllBadges().filter(badge => badge.category === category);
};

export default BADGE_DEFINITIONS;
