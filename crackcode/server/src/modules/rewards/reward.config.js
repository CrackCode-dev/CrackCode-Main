// CENTRALIZED REWARD CONFIGURATION
// This is the single source of truth for all rewards across the platform
// Used by: reward.service.js, rewards.controller.js, codeEditor.submit.service.js
// DO NOT duplicate these values elsewhere

export const CODING_REWARD_CONFIG = {
  Easy: { xp: 10, tokens: 6 },
  easy: { xp: 10, tokens: 6 },
  Medium: { xp: 20, tokens: 8 },
  medium: { xp: 20, tokens: 8 },
  Intermediate: { xp: 20, tokens: 8 },
  intermediate: { xp: 20, tokens: 8 },
  Hard: { xp: 35, tokens: 12 },
  hard: { xp: 35, tokens: 12 },
};

export const MCQ_REWARD_CONFIG = {
  easy: { xp: 5, tokens: 2 },
  medium: { xp: 10, tokens: 5 },
  hard: { xp: 15, tokens: 8 },
};

export const BRONFIELD_REWARD_CONFIG = {
  easy: { xp: 3, tokens: 1 },
  medium: { xp: 8, tokens: 4 },
  hard: { xp: 12, tokens: 6 },
};

/*
 Get reward for an activity
activityType - 'coding', 'mcq', 'bronfield'
difficulty - difficulty level
returns {Object} {xp, tokens}
 */
export function getRewardConfig(activityType, difficulty) {
  const key = (difficulty || '').toLowerCase();
  let config = null;

  switch (activityType) {
    case 'coding':
      config = CODING_REWARD_CONFIG[key];
      break;
    case 'mcq':
      config = MCQ_REWARD_CONFIG[key];
      break;
    case 'bronfield':
      config = BRONFIELD_REWARD_CONFIG[key];
      break;
    default:
      config = null;
  }

  return config || { xp: 0, tokens: 0 };
}

/*
Future: Bonus multipliers (not in Phase 1)
 
 BONUS_CONFIG = {
 FIRST_ATTEMPT: 1.5,
 NO_HINTS: 1.2,
 SpPEED_BONUS: 1.1,
  STREAK_MULTIPLIER: (streak) => 1 + (streak * 0.05)

 */

export const SOURCE_AREAS = [
  'home_challenge',
  'learn_page',
  'case_log',
  'career_map',
];

export const ACTIVITY_TYPES = ['coding', 'mcq', 'bronfield'];
