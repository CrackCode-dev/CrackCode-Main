/*
 Handles badge checking, unlocking, and progress tracking
 */

import User from "../auth/User.model.js";
import BADGE_DEFINITIONS, { getAllBadges } from "./badge.config.js";

/*
Check if user qualifies for a badge and unlock if necessary
userId - MongoDB user ID
badgeId - Badge ID from config
returns {boolean} - True if badge was newly unlocked
 */
export const checkAndUnlockBadge = async (userId, badgeId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.warn(`❌ Badge check: User ${userId} not found`);
      return false;
    }

    // Check if already unlocked
    if (user.unlockedBadges?.includes(badgeId)) {
      return false;
    }

    const badge = getBadgeDefinition(badgeId);
    if (!badge) {
      console.warn(`❌ Badge check: Badge ${badgeId} not found in config`);
      return false;
    }

    // Evaluate condition
    const shouldUnlock = evaluateBadgeCondition(badge.condition, user);

    if (shouldUnlock) {
      // Add to unlockedBadges array
      await User.findByIdAndUpdate(userId, {
        $addToSet: { unlockedBadges: badgeId },
        $inc: { badgeCount: 1 }
      });

      console.log(`✅ Badge unlocked for user ${userId}: ${badgeId}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error checking badge ${badgeId} for user ${userId}:`, error.message);
    return false;
  }
};

/*
  Check and unlock multiple badges at once (called after major actions)
userId - MongoDB user ID
badgeIds - Array of badge IDs to check
returns {string[]} - Array of newly unlocked badge IDs
 */
export const checkAndUnlockMultipleBadges = async (userId, badgeIds = []) => {
  const newlyUnlocked = [];

  for (const badgeId of badgeIds) {
    const wasUnlocked = await checkAndUnlockBadge(userId, badgeId);
    if (wasUnlocked) {
      newlyUnlocked.push(badgeId);
    }
  }

  return newlyUnlocked;
};

/*
Check ALL badges for a user (general refresh)
userId - MongoDB user ID
returns {string[]} - Array of newly unlocked badge IDs
 */
export const checkAllBadgesForUser = async (userId) => {
  const allBadges = getAllBadges();
  const badgeIds = allBadges.map(b => b.id);
  return checkAndUnlockMultipleBadges(userId, badgeIds);
};

/*
 Get user's badge progress
 userId - MongoDB user ID
returns {Array} - Badge objects with isUnlocked and progress properties
 */
export const getUserBadgeProgress = async (userId) => {
  try {
    const user = await User.findById(userId).select('unlockedBadges casesSolved totalXP rank');

    if (!user) {
      console.warn(`❌ Badge progress: User ${userId} not found`);
      return [];
    }

    const allBadges = getAllBadges();

    return allBadges.map(badge => {
      const isUnlocked = user.unlockedBadges?.includes(badge.id) || false;
      const progress = calculateBadgeProgress(badge.condition, user);

      return {
        ...badge,
        isUnlocked,
        progress: Math.min(progress, 100)
      };
    });
  } catch (error) {
    console.error(`❌ Error getting badge progress for user ${userId}:`, error.message);
    return [];
  }
};

/*
 Get user's unlocked badges count
userId - MongoDB user ID
returns {Object} - { unlocked: number, total: number, badges: [] }
 */
export const getUserBadgeStats = async (userId) => {
  try {
    const user = await User.findById(userId).select('unlockedBadges');

    if (!user) {
      return { unlocked: 0, total: getAllBadges().length, badges: [] };
    }

    const unlockedCount = user.unlockedBadges?.length || 0;
    const totalCount = getAllBadges().length;

    return {
      unlocked: unlockedCount,
      total: totalCount,
      badges: user.unlockedBadges || [],
      percentage: Math.round((unlockedCount / totalCount) * 100)
    };
  } catch (error) {
    console.error(`❌ Error getting badge stats for user ${userId}:`, error.message);
    return { unlocked: 0, total: getAllBadges().length, badges: [] };
  }
};

 
// HELPER FUNCTIONS


/*
  Get badge definition from config
 */
function getBadgeDefinition(badgeId) {
  const badge = BADGE_DEFINITIONS[Object.keys(BADGE_DEFINITIONS).find(
    key => BADGE_DEFINITIONS[key].id === badgeId
  )];
  return badge;
}

/*
 Evaluate badge unlock condition
condition - Condition string from badge config
user - User document from MongoDB
returns {boolean} - Whether condition is met
 */
function evaluateBadgeCondition(condition, user) {
  try {
    // Handle signup/account creation badge
    if (condition === 'accountCreated') {
      return true; // Always true for any existing user
    }

    // Simple condition parser - can be extended for complex logic
    if (condition.includes('casesSolved')) {
      const match = condition.match(/casesSolved >= (\d+)/);
      if (match) {
        return user.casesSolved >= parseInt(match[1]);
      }
    }

    if (condition.includes('leaderboardRank')) {
      const match = condition.match(/leaderboardRank <= (\d+)/);
      if (match) {
        // Rank is stored via calculation, would need leaderboard lookup in real scenario
        // For now, we check if user is in top 3 via position field
        return user.leaderboardPosition <= parseInt(match[1]);
      }
    }

    if (condition === 'pythonCareerComplete') {
      return user.completedCareers?.includes('MLEngineer') || user.completedCareers?.includes('DataScientist');
    }

    if (condition === 'cppCareerComplete') {
      return user.completedCareers?.includes('SoftwareEngineer');
    }

    if (condition === 'javaCareerComplete') {
      return user.completedCareers?.includes('SoftwareEngineer');
    }

    if (condition === 'javascriptCareerComplete') {
      return user.completedCareers?.includes('DataScientist');
    }

    if (condition === 'allCareersComplete') {
      return user.completedCareers?.length === 3; // All 3 careers
    }

    return false;
  } catch (error) {
    console.error(`Error evaluating condition: ${condition}`, error.message);
    return false;
  }
}

/*
 Calculate progress towards a badge (0-100%)
 */
function calculateBadgeProgress(condition, user) {
  try {
    if (condition.includes('casesSolved')) {
      const match = condition.match(/casesSolved >= (\d+)/);
      if (match) {
        const required = parseInt(match[1]);
        return Math.min((user.casesSolved / required) * 100, 100);
      }
    }

    if (condition.includes('leaderboardRank')) {
      // Progress based on XP (as proxy for leaderboard position)
      return Math.min((user.totalXP / 5000) * 100, 100);
    }

    if (condition.includes('Career')) {
      const careers = user.completedCareers?.length || 0;
      const required = condition === 'allCareersComplete' ? 3 : 1;
      return Math.min((careers / required) * 100, 100);
    }

    return 0;
  } catch (error) {
    console.error(`Error calculating progress for condition: ${condition}`, error.message);
    return 0;
  }
}

export default {
  checkAndUnlockBadge,
  checkAndUnlockMultipleBadges,
  checkAllBadgesForUser,
  getUserBadgeProgress,
  getUserBadgeStats
};
