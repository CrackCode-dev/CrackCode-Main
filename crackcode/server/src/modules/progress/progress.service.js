import UserQuestionProgress from './UserQuestionProgress.model.js';
import mongoose from 'mongoose';

/*
userId - User ID
questionId - Question ID
questionType - Type: coding, mcq, bronfield
sourceArea - Where solved from: home_challenge, learn_page, etc.
testCasesPassed - Number of test cases passed
testCasesTotal - Total test cases
returns {Promise<Object>} Updated progress document
 */
export async function markQuestionSolved(
  userId,
  questionId,
  questionType,
  sourceArea,
  testCasesPassed = 0,
  testCasesTotal = 0
) {
  try {
    const userIdObj = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    let progress = await UserQuestionProgress.findOne({
      userId: userIdObj,
      questionId,
      questionType,
    });

    if (!progress) {
      // First time solving
      progress = new UserQuestionProgress({
        userId: userIdObj,
        questionId,
        questionType,
        sourceArea,
        solved: true,
        attempts: 1,
        firstSolvedAt: new Date(),
        lastSubmittedAt: new Date(),
        testCasesPassed,
        testCasesTotal,
      });
    } else {
      // Already solved before, just update
      progress.solved = true;
      progress.attempts += 1;
      progress.lastSubmittedAt = new Date();
      progress.testCasesPassed = testCasesPassed;
      progress.testCasesTotal = testCasesTotal;
    }

    await progress.save();
    return progress;
  } catch (error) {
    console.error('Error marking question solved:', error);
    throw error;
  }
}

/*
 Increment attempt count for a question
 
userId - User ID
questionId - Question ID
questionType - Type of question
returns {Promise<Object>} Updated progress
 */
export async function incrementAttempt(userId, questionId, questionType) {
  try {
    const userIdObj = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    let progress = await UserQuestionProgress.findOne({
      userId: userIdObj,
      questionId,
      questionType,
    });

    if (!progress) {
      progress = new UserQuestionProgress({
        userId: userIdObj,
        questionId,
        questionType,
        attempts: 1,
        lastSubmittedAt: new Date(),
      });
    } else {
      progress.attempts += 1;
      progress.lastSubmittedAt = new Date();
    }

    await progress.save();
    return progress;
  } catch (error) {
    console.error('Error incrementing attempt:', error);
    throw error;
  }
}

/*
  Get all solved questions for a user
  
uuserId - User ID
questionType - Optional filter by question type
returns {Promise<Array>} Array of solved question progress
 */
export async function getUserSolvedQuestions(userId, questionType = null) {
  try {
    const userIdObj = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const filter = {
      userId: userIdObj,
      solved: true,
    };

    if (questionType) {
      filter.questionType = questionType;
    }

    const solvedQuestions = await UserQuestionProgress.find(filter).sort({
      firstSolvedAt: -1,
    });

    return solvedQuestions;
  } catch (error) {
    console.error('Error getting solved questions:', error);
    throw error;
  }
}

/*
Check if a user has solved a specific question
userId - User ID
questionId - Question ID
questionType - Type of question
returns {Promise<boolean>} True if solved, false otherwise
 */
export async function isQuestionSolved(userId, questionId, questionType) {
  try {
    const userIdObj = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const progress = await UserQuestionProgress.findOne({
      userId: userIdObj,
      questionId,
      questionType,
      solved: true,
    });

    return !!progress;
  } catch (error) {
    console.error('Error checking if question solved:', error);
    return false;
  }
}

/*
 Get user's progress summary
userId - User ID
returns {Promise<Object>} Progress summary
 */
export async function getUserProgressSummary(userId) {
  try {
    const userIdObj = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const progress = await UserQuestionProgress.aggregate([
      { $match: { userId: userIdObj } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: '$attempts' },
          totalSolved: { $sum: { $cond: [{ $eq: ['$solved', true] }, 1, 0] } },
          totalRewarded: { $sum: { $cond: [{ $eq: ['$rewarded', true] }, 1, 0] } },
          byType: {
            $push: {
              type: '$questionType',
              solved: '$solved',
            },
          },
        },
      },
    ]);

    if (progress.length === 0) {
      return {
        totalAttempts: 0,
        totalSolved: 0,
        totalRewarded: 0,
        byType: {},
      };
    }

    return progress[0];
  } catch (error) {
    console.error('Error getting progress summary:', error);
    throw error;
  }
}
