import { awardXP, awardTokens, awardRewards } from "../session/transaction.service.js";
import UserProgress from "../learn/UserProgress.model.js";
import Question from "../learn/Question.model.js";

/**
 * Reward configuration based on difficulty
 */
const REWARD_CONFIG = {
  Easy: { xp: 10, tokens: 5 },
  Medium: { xp: 25, tokens: 15 },
  Hard: { xp: 50, tokens: 30 },
};

/**
 * Daily bonus multiplier
 */
const DAILY_STREAK_MULTIPLIER = {
  1: 1.0,
  2: 1.1,
  3: 1.2,
  4: 1.3,
  5: 1.4,
  6: 1.5,
  7: 2.0, // Week streak bonus
};

/**
 * Award rewards for completing a coding challenge
 */
export const awardChallengeCompletion = async (req, res) => {
  try {
    const { questionId, isFirstAttempt = false } = req.body;
    const userId = req.userId;
    
    // Get question details
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }
    
    // Check if already completed (prevent farming)
    const existingProgress = await UserProgress.findOne({
      userId,
      questionId,
      status: "completed",
    });
    
    if (existingProgress) {
      return res.json({
        success: true,
        message: "Challenge already completed. No additional rewards.",
        rewards: { xp: 0, tokens: 0 },
        alreadyCompleted: true,
      });
    }
    
    // Calculate rewards
    const baseRewards = REWARD_CONFIG[question.difficulty] || REWARD_CONFIG.Easy;
    
    let xpReward = baseRewards.xp;
    let tokenReward = baseRewards.tokens;
    
    // First attempt bonus (50% extra)
    if (isFirstAttempt) {
      xpReward = Math.floor(xpReward * 1.5);
      tokenReward = Math.floor(tokenReward * 1.5);
    }
    
    // Award the rewards atomically
    const result = await awardRewards(
      userId,
      xpReward,
      tokenReward,
      `challenge:${question._id}`
    );
    
    // Update progress
    await UserProgress.findOneAndUpdate(
      { userId, questionId },
      {
        status: "completed",
        completedAt: new Date(),
        $inc: { attempts: 1 },
      },
      { upsert: true, new: true }
    );
    
    return res.json({
      success: true,
      message: "Challenge completed! Rewards awarded.",
      rewards: {
        xp: xpReward,
        tokens: tokenReward,
      },
      newTotals: {
        xp: result.xp,
        totalXP: result.totalXP,
        tokens: result.tokens,
        rank: result.rank,
      },
    });
  } catch (error) {
    console.error("Award challenge completion error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to award rewards",
    });
  }
};

/**
 * Award rewards for completing a quiz
 */
export const awardQuizCompletion = async (req, res) => {
  try {
    const { quizId, score, maxScore, timeBonus = 0 } = req.body;
    const userId = req.userId;
    
    // Calculate percentage
    const percentage = (score / maxScore) * 100;
    
    // Base rewards based on score
    let xpReward = 0;
    let tokenReward = 0;
    
    if (percentage >= 100) {
      xpReward = 50;
      tokenReward = 25;
    } else if (percentage >= 80) {
      xpReward = 30;
      tokenReward = 15;
    } else if (percentage >= 60) {
      xpReward = 15;
      tokenReward = 8;
    } else if (percentage >= 40) {
      xpReward = 5;
      tokenReward = 2;
    }
    
    // Add time bonus (up to 20% extra)
    if (timeBonus > 0) {
      const bonusMultiplier = Math.min(timeBonus, 20) / 100;
      xpReward = Math.floor(xpReward * (1 + bonusMultiplier));
      tokenReward = Math.floor(tokenReward * (1 + bonusMultiplier));
    }
    
    if (xpReward === 0 && tokenReward === 0) {
      return res.json({
        success: true,
        message: "Quiz completed, but score too low for rewards.",
        rewards: { xp: 0, tokens: 0 },
      });
    }
    
    // Award rewards
    const result = await awardRewards(
      userId,
      xpReward,
      tokenReward,
      `quiz:${quizId}`
    );
    
    return res.json({
      success: true,
      message: "Quiz completed! Rewards awarded.",
      rewards: {
        xp: xpReward,
        tokens: tokenReward,
      },
      score: {
        points: score,
        max: maxScore,
        percentage,
      },
      newTotals: {
        xp: result.xp,
        totalXP: result.totalXP,
        tokens: result.tokens,
        rank: result.rank,
      },
    });
  } catch (error) {
    console.error("Award quiz completion error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to award rewards",
    });
  }
};

/**
 * Award daily login bonus
 */
export const awardDailyBonus = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Check Redis for last claim
    const redisClient = (await import("../leaderboard/redis.config.js")).default;
    
    if (redisClient.isOpen) {
      const lastClaim = await redisClient.get(`daily:${userId}`);
      
      if (lastClaim) {
        const lastClaimDate = new Date(lastClaim);
        const now = new Date();
        
        // Check if already claimed today
        if (
          lastClaimDate.toDateString() === now.toDateString()
        ) {
          return res.json({
            success: false,
            message: "Daily bonus already claimed today",
            nextAvailable: getNextMidnight(),
          });
        }
      }
    }
    
    // Base daily bonus
    const dailyXP = 10;
    const dailyTokens = 5;
    
    // Award bonus
    const result = await awardRewards(userId, dailyXP, dailyTokens, "daily_bonus");
    
    // Mark as claimed in Redis (expires at midnight)
    if (redisClient.isOpen) {
      const secondsUntilMidnight = getSecondsUntilMidnight();
      await redisClient.setEx(`daily:${userId}`, secondsUntilMidnight, new Date().toISOString());
    }
    
    return res.json({
      success: true,
      message: "Daily bonus claimed!",
      rewards: {
        xp: dailyXP,
        tokens: dailyTokens,
      },
      newTotals: {
        xp: result.xp,
        totalXP: result.totalXP,
        tokens: result.tokens,
      },
    });
  } catch (error) {
    console.error("Award daily bonus error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to claim daily bonus",
    });
  }
};

/**
 * Award achievement unlock bonus
 */
export const awardAchievement = async (req, res) => {
  try {
    const { achievementId, xpReward = 0, tokenReward = 0 } = req.body;
    const userId = req.userId;
    
    // Verify achievement exists and isn't already unlocked
    const User = (await import("../auth/User.model.js")).default;
    const user = await User.findById(userId);
    
    const alreadyUnlocked = user.achievements.some(
      (a) => a.achievement?.toString() === achievementId
    );
    
    if (alreadyUnlocked) {
      return res.json({
        success: false,
        message: "Achievement already unlocked",
      });
    }
    
    // Award rewards
    let result = null;
    if (xpReward > 0 || tokenReward > 0) {
      result = await awardRewards(userId, xpReward, tokenReward, `achievement:${achievementId}`);
    }
    
    // Add achievement to user
    await User.findByIdAndUpdate(userId, {
      $push: {
        achievements: {
          achievement: achievementId,
          unlockedAt: new Date(),
        },
      },
    });
    
    return res.json({
      success: true,
      message: "Achievement unlocked!",
      rewards: {
        xp: xpReward,
        tokens: tokenReward,
      },
      newTotals: result ? {
        xp: result.xp,
        totalXP: result.totalXP,
        tokens: result.tokens,
      } : null,
    });
  } catch (error) {
    console.error("Award achievement error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to unlock achievement",
    });
  }
};

// Helper functions
const getNextMidnight = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

const getSecondsUntilMidnight = () => {
  const now = new Date();
  const midnight = getNextMidnight();
  return Math.floor((midnight - now) / 1000);
};