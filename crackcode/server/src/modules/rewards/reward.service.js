import { getRewardConfig } from './reward.config.js';
import User from '../auth/User.model.js';
import UserQuestionProgress from '../progress/UserQuestionProgress.model.js';
import { checkAndUnlockMultipleBadges } from '../badges/badge.service.js';
import { ensureObjectId } from '../../utils/idConverter.js';

/*
Award XP and tokens to a user for solving a question
This is the main reward function. It:
1. Checks if already rewarded
2. Calculates reward
3. Updates user collection
4. Updates progress tracking
userId - User ID
questionId - Question ID
questionType - Type of question (coding, mcq, bronfield)
difficulty - Difficulty level
sourceArea - Where question was solved from
returns {Promise<Object>} Reward result with xpAwarded, tokensAwarded, alreadyRewarded
 */
export async function awardReward(userId, questionId, questionType, difficulty, sourceArea) {
  try {
    console.log('🎁 awardReward called:', { userId, questionId, questionType, difficulty, sourceArea });
    
    // Convert userId to ObjectId
    const userIdObj = ensureObjectId(userId);
    console.log('🆔 Converted userId:', userIdObj);
    
    // Step 1: Get or create user question progress
    let progress = await UserQuestionProgress.findOne({
      userId: userIdObj,
      questionId,
      questionType,
    });

    console.log('📝 Existing progress found:', !!progress);

    const isFirstSolve = !progress;

    if (!progress) {
      // First time solving this question
      const rewardConfig = getRewardConfig(questionType, difficulty);
      console.log('🏆 First solve! Reward config:', rewardConfig);

      progress = new UserQuestionProgress({
        userId: userIdObj,
        questionId,
        questionType,
        sourceArea,
        solved: true,
        rewarded: true,
        xpAwarded: rewardConfig.xp,
        tokensAwarded: rewardConfig.tokens,
        attempts: 1,
        firstSolvedAt: new Date(),
        lastSubmittedAt: new Date(),
      });

      await progress.save();
      console.log('✅ Progress saved to DB');

      // Step 2: Update user collection with incremented totalXP and tokens
      const user = await User.findByIdAndUpdate(
        userIdObj,
        {
          $inc: {
            totalXP: rewardConfig.xp,
            tokens: rewardConfig.tokens,
            casesSolved: 1,
          },
          $addToSet: {
            solvedChallengeIds: questionId.toString()
          }
        },
        { new: true }
      );

      console.log('✅ User updated:', { totalXP: user.totalXP, tokens: user.tokens });

      // Step 3: Check and unlock badges based on new casesSolved count
      let badgesUnlocked = [];
      try {
        const badgesToCheck = ['beginner', 'cases_5', 'cases_10', 'cases_25'];
        badgesUnlocked = await checkAndUnlockMultipleBadges(userIdObj.toString(), badgesToCheck);
        if (badgesUnlocked.length > 0) {
          console.log(`✅ New badges unlocked: ${badgesUnlocked.join(', ')}`);
        }
      } catch (badgeErr) {
        console.error('⚠️ Badge unlock error:', badgeErr.message);
        // Don't fail the reward if badge check fails
      }

      return {
        success: true,
        xpAwarded: rewardConfig.xp,
        tokensAwarded: rewardConfig.tokens,
        alreadyRewarded: false,
        isFirstSolve: true,
        badgesUnlocked: badgesUnlocked,
        updatedUserStats: {
          tokens: user.tokens,
          totalXP: user.totalXP,
          casesSolved: user.casesSolved,
        },
      };
    }

    // Question was already solved before
    if (progress.rewarded) {
      // Already rewarded, do NOT give reward again
      console.log('⚠️ Already rewarded for this question');
      const existingUser = await User.findById(userIdObj);
      return {
        success: true,
        xpAwarded: 0,
        tokensAwarded: 0,
        alreadyRewarded: true,
        isFirstSolve: false,
        updatedUserStats: {
          tokens: existingUser.tokens,
          totalXP: existingUser.totalXP,
        },
      };
    }

    // Solved but not rewarded (shouldn't happen in normal flow, but handle it)
    const rewardConfig = getRewardConfig(questionType, difficulty);
    progress.rewarded = true;
    progress.xpAwarded = rewardConfig.xp;
    progress.tokensAwarded = rewardConfig.tokens;
    progress.lastSubmittedAt = new Date();
    await progress.save();

    const user = await User.findByIdAndUpdate(
      userIdObj,
      {
        $inc: {
          totalXP: rewardConfig.xp,
          tokens: rewardConfig.tokens,
        },
      },
      { new: true }
    );

    return {
      success: true,
      xpAwarded: rewardConfig.xp,
      tokensAwarded: rewardConfig.tokens,
      alreadyRewarded: false,
      isFirstSolve: false,
      updatedUserStats: {
        tokens: user.tokens,
        totalXP: user.totalXP,
      },
    };
  } catch (error) {
    console.error('Error awarding reward:', error);
    throw error;
  }
}

/*
Check if a user has already solved and been rewarded for a question
  
userId - User ID
questionId - Question ID
questionType - Type of question
returns {Promise<Object>} Progress data if exists, null otherwise
 */
export async function checkProgress(userId, questionId, questionType) {
  try {
    const userIdObj = ensureObjectId(userId);

    const progress = await UserQuestionProgress.findOne({
      userId: userIdObj,
      questionId,
      questionType,
    });

    return progress;
  } catch (error) {
    console.error('Error checking progress:', error);
    return null;
  }
}

/*
 Get user's total solved questions and reward stats
 
userId - User ID
returns {Promise<Object>} Summary stats
 */
export async function getUserRewardStats(userId) {
  try {
    const userIdObj = ensureObjectId(userId);

    const stats = await UserQuestionProgress.aggregate([
      { $match: { userId: userIdObj, solved: true } },
      {
        $group: {
          _id: null,
          totalSolved: { $sum: 1 },
          totalRewarded: {
            $sum: { $cond: [{ $eq: ['$rewarded', true] }, 1, 0] },
          },
          totalXpAwarded: { $sum: '$xpAwarded' },
          totalTokensAwarded: { $sum: '$tokensAwarded' },
        },
      },
    ]);

    if (stats.length === 0) {
      return {
        totalSolved: 0,
        totalRewarded: 0,
        totalXpAwarded: 0,
        totalTokensAwarded: 0,
      };
    }

    return stats[0];
  } catch (error) {
    console.error('Error getting reward stats:', error);
    throw error;
  }
}
