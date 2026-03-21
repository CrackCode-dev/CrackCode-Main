/*
 Handles badge checking, unlocking, and progress tracking
 */

import User from "../auth/User.model.js";
import BADGE_DEFINITIONS, { getAllBadges } from "./badge.config.js";

// Each language has multiple difficulties (Easy, Medium, Hard) with 15 questions each
// Total: 4 difficulties × 15 questions = 60 questions per language

export const LANGUAGE_BADGE_CONFIG = {
  python: {
    totalQuestions: 60,     
    unlockThreshold: 0.50   // 50% completion = unlock badge (30 out of 60 questions)
  },
  javascript: {
    totalQuestions: 60,
    unlockThreshold: 0.50
  },
  java: {
    totalQuestions: 60,
    unlockThreshold: 0.50
  },
  cpp: {
    totalQuestions: 60,
    unlockThreshold: 0.50
  }
};

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

    // Fetch language-specific question counts for badge evaluation
    const UserQuestionProgress = (await import('../progress/UserQuestionProgress.model.js')).default;
    const languageCounts = {};
    
    try {
      const langAgg = await UserQuestionProgress.aggregate([
        { $match: { userId: user._id } },
        { $group: { _id: '$language', count: { $sum: 1 } } }
      ]);
      
      langAgg.forEach(item => {
        const lang = (item._id || '').toLowerCase();
        if (lang.includes('py') || lang === 'python') languageCounts.python = item.count;
        else if (lang.includes('js') || lang === 'javascript') languageCounts.javascript = item.count;
        else if (lang.includes('java') && !lang.includes('script')) languageCounts.java = item.count;
        else if (lang.includes('cpp') || lang.includes('c++') || lang === 'c++') languageCounts.cpp = item.count;
      });
    } catch (err) {
      console.warn('⚠️ Error fetching language counts:', err.message);
    }

    // Evaluate condition with language counts
    const shouldUnlock = evaluateBadgeCondition(badge.condition, user, languageCounts);

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

    // Fetch language-specific question counts from UserQuestionProgress
    const UserQuestionProgress = (await import('../progress/UserQuestionProgress.model.js')).default;
    const languageCounts = {};
    
    try {
      const langAgg = await UserQuestionProgress.aggregate([
        { $match: { userId: user._id } },
        { $group: { _id: '$language', count: { $sum: 1 } } }
      ]);
      
      langAgg.forEach(item => {
        const lang = (item._id || '').toLowerCase();
        if (lang.includes('py') || lang === 'python') languageCounts.python = item.count;
        else if (lang.includes('js') || lang === 'javascript') languageCounts.javascript = item.count;
        else if (lang.includes('java') && !lang.includes('script')) languageCounts.java = item.count;
        else if (lang.includes('cpp') || lang.includes('c++') || lang === 'c++') languageCounts.cpp = item.count;
      });
    } catch (err) {
      console.warn('⚠️ Error fetching language counts:', err.message);
    }

    const allBadges = getAllBadges();

    return allBadges.map(badge => {
      const isUnlocked = user.unlockedBadges?.includes(badge.id) || false;
      const progress = calculateBadgeProgress(badge.condition, user, languageCounts);

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
function evaluateBadgeCondition(condition, user, languageCounts = {}) {
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

    // Language-specific badges: use threshold from config
    // User must complete at least unlockThreshold% of questions in that language
    if (condition === 'pythonCareerComplete') {
      const pythonCount = languageCounts.python || 0;
      const config = LANGUAGE_BADGE_CONFIG.python;
      const threshold = config.totalQuestions * config.unlockThreshold;
      return pythonCount >= threshold;
    }

    if (condition === 'javascriptCareerComplete') {
      const jsCount = languageCounts.javascript || 0;
      const config = LANGUAGE_BADGE_CONFIG.javascript;
      const threshold = config.totalQuestions * config.unlockThreshold;
      return jsCount >= threshold;
    }

    if (condition === 'javaCareerComplete') {
      const javaCount = languageCounts.java || 0;
      const config = LANGUAGE_BADGE_CONFIG.java;
      const threshold = config.totalQuestions * config.unlockThreshold;
      return javaCount >= threshold;
    }

    if (condition === 'cppCareerComplete') {
      const cppCount = languageCounts.cpp || 0;
      const config = LANGUAGE_BADGE_CONFIG.cpp;
      const threshold = config.totalQuestions * config.unlockThreshold;
      return cppCount >= threshold;
    }

    if (condition === 'allCareersComplete') {
      // Check if user has met the threshold in all 4 languages
      const configs = [
        { lang: 'python', key: 'python' },
        { lang: 'javascript', key: 'javascript' },
        { lang: 'java', key: 'java' },
        { lang: 'cpp', key: 'cpp' }
      ];
      
      return configs.every(({ key }) => {
        const count = languageCounts[key] || 0;
        const config = LANGUAGE_BADGE_CONFIG[key];
        const threshold = config.totalQuestions * config.unlockThreshold;
        return count >= threshold;
      });
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
function calculateBadgeProgress(condition, user, languageCounts = {}) {
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

    // Language-specific badges: use dynamic total questions from config
    if (condition === 'pythonCareerComplete') {
      const pythonCount = languageCounts.python || 0;
      const totalPython = LANGUAGE_BADGE_CONFIG.python.totalQuestions || 60;
      return Math.min((pythonCount / totalPython) * 100, 100);
    }

    if (condition === 'javascriptCareerComplete') {
      const jsCount = languageCounts.javascript || 0;
      const totalJS = LANGUAGE_BADGE_CONFIG.javascript.totalQuestions || 60;
      return Math.min((jsCount / totalJS) * 100, 100);
    }

    if (condition === 'javaCareerComplete') {
      const javaCount = languageCounts.java || 0;
      const totalJava = LANGUAGE_BADGE_CONFIG.java.totalQuestions || 60;
      return Math.min((javaCount / totalJava) * 100, 100);
    }

    if (condition === 'cppCareerComplete') {
      const cppCount = languageCounts.cpp || 0;
      const totalCpp = LANGUAGE_BADGE_CONFIG.cpp.totalQuestions || 60;
      return Math.min((cppCount / totalCpp) * 100, 100);
    }

    if (condition === 'allCareersComplete') {
      // Progress based on total languages at threshold
      let languagesAtThreshold = 0;
      [
        { lang: 'python', key: 'python' },
        { lang: 'javascript', key: 'javascript' },
        { lang: 'java', key: 'java' },
        { lang: 'cpp', key: 'cpp' }
      ].forEach(({ lang, key }) => {
        const count = languageCounts[key] || 0;
        const total = LANGUAGE_BADGE_CONFIG[key].totalQuestions || 60;
        const threshold = LANGUAGE_BADGE_CONFIG[key].unlockThreshold || 0.5;
        if (count / total >= threshold) {
          languagesAtThreshold++;
        }
      });
      return Math.min((languagesAtThreshold / 4) * 100, 100);
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
