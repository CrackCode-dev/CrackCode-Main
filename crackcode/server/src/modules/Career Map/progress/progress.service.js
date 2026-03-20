import Progress from "./progress.model.js";
import User from "../../auth/User.model.js";
import { checkAndUnlockMultipleBadges } from "../../badges/badge.service.js";

// Helper = recompute overall totals from all chapters
const recomputeTotals = (chapters) => {
  const easyScore = chapters.reduce((sum, ch) => sum + ch.easyScore, 0);
  const mediumScore = chapters.reduce((sum, ch) => sum + ch.mediumScore, 0);
  const hardScore = chapters.reduce((sum, ch) => sum + ch.hardScore, 0);

  return {
    easyScore,
    mediumScore,
    hardScore,
    easyCompleted: easyScore >= 5,
    mediumCompleted: mediumScore >= 5,
    hardCompleted: hardScore >= 5,
  };
};

// Update progress when user finishes a chapter
export const updateChapterProgress = async (userId, career, chapterId, easyScore, mediumScore, hardScore, passed) => {
  //  VALIDATION: Ensure scores are nonnegative integers
  easyScore = Math.max(0, parseInt(easyScore) || 0);
  mediumScore = Math.max(0, parseInt(mediumScore) || 0);
  hardScore = Math.max(0, parseInt(hardScore) || 0);
  
  const newTotal = easyScore + mediumScore + hardScore;
  
  //  Sanity check: total score shouldn't exceed 100 (reasonable quiz limit)
  if (newTotal > 100) {
    throw new Error(`Invalid score: total (${newTotal}) exceeds maximum of 100. Possible cheating attempt.`);
  }

  // Find existing progress document for this user + career
  let progress = await Progress.findOne({ userId, career });

  // Create new progress document if doesn't exist
  if (!progress) {
    progress = await Progress.create({ userId, career, chapters: [] });
  }

  // Check if this chapter has been attempted before
  const existingIndex = progress.chapters.findIndex(ch => ch.chapterId === chapterId);

  // Determine previous scores
  let previousEasy = 0;
  let previousMedium = 0;
  let previousHard = 0;
  let previousRewarded = 0;
  let previouslyPassed = false;

  if (existingIndex >= 0) {
    const existing = progress.chapters[existingIndex];
    previousEasy = existing.easyScore || 0;
    previousMedium = existing.mediumScore || 0;
    previousHard = existing.hardScore || 0;
    previousRewarded = existing.rewardedQuestions || 0;
    previouslyPassed = !!existing.passed;
  }

  //  Update progress FIRST before awarding rewards
  if (existingIndex >= 0) {
    // Chapter exists  update scores
    await Progress.updateOne(
      { userId, career, "chapters.chapterId": chapterId },
      {
        $set: {
          "chapters.$.easyScore": easyScore,
          "chapters.$.mediumScore": mediumScore,
          "chapters.$.hardScore": hardScore,
          "chapters.$.passed": passed,
        },
        $inc: { "chapters.$.attempts": 1 }
      }
    );
  } else {
    // Chapter doesn't exist  push new chapter entry into array
    await Progress.updateOne(
      { userId, career },
      { $push: { chapters: { chapterId, easyScore, mediumScore, hardScore, passed, attempts: 1 } } }
    );
  }

  //RECOMPUTE TOTALS AND UPDATE MAIN PROGRESS
  progress = await Progress.findOne({ userId, career });
  const totals = recomputeTotals(progress.chapters);

  await Progress.findOneAndUpdate(
    { userId, career },
    {
      $set: {
        easyScore: totals.easyScore,
        mediumScore: totals.mediumScore,
        hardScore: totals.hardScore,
        easyCompleted: totals.easyCompleted,
        mediumCompleted: totals.mediumCompleted,
        hardCompleted: totals.hardCompleted,
      }
    },
    { returnDocument: "after" }
  );

  // AWARD XP/TOKENS only if newly passed (prevents duplicate rewards)
  let tokensAwarded = 0;
  let xpAwarded = 0;

  if (passed && !previouslyPassed) {
    // First time passing: award for ALL correct answers
    tokensAwarded = newTotal;
    xpAwarded = newTotal * 3;
    
    try {
      await User.findByIdAndUpdate(userId, {
        $inc: {
          tokens: tokensAwarded,
          totalXP: xpAwarded,
          casesSolved: tokensAwarded
        }
      });

      // Record this in progress so we don't re-award on retry
      await Progress.updateOne(
        { userId, career, "chapters.chapterId": chapterId },
        { $set: { "chapters.$.rewardedQuestions": newTotal } }
      );
      console.log(`✅ First-time pass reward: ${tokensAwarded} tokens, ${xpAwarded} XP to user ${userId} for ${career}/${chapterId}`);

      // Check and unlock relevant badges
      const badgesToCheck = ['beginner', 'cases_5', 'cases_10', 'cases_25'];
      const newlyUnlocked = await checkAndUnlockMultipleBadges(userId, badgesToCheck);
      if (newlyUnlocked.length > 0) {
        console.log(`✅ New badges unlocked: ${newlyUnlocked.join(', ')}`);
      }
    } catch (err) {
      console.error(`❌ Failed to award first-time pass rewards for user ${userId}:`, err.message);
    }
  } else if (passed && previouslyPassed && newTotal > previousRewarded) {
    // Already passed before: only award for NEW correct answers (improvement bonus)
    tokensAwarded = newTotal - previousRewarded;
    xpAwarded = tokensAwarded * 3;
    
    try {
      await User.findByIdAndUpdate(userId, {
        $inc: {
          tokens: tokensAwarded,
          totalXP: xpAwarded,
          casesSolved: tokensAwarded
        }
      });

      // Update rewardedQuestions to track the new high score
      await Progress.updateOne(
        { userId, career, "chapters.chapterId": chapterId },
        { $set: { "chapters.$.rewardedQuestions": newTotal } }
      );
      console.log(`✅ Improvement bonus: +${tokensAwarded} tokens, +${xpAwarded} XP to user ${userId} for ${career}/${chapterId}`);

      //  Check and unlock relevant badges
      const badgesToCheck = ['beginner', 'cases_5', 'cases_10', 'cases_25'];
      const newlyUnlocked = await checkAndUnlockMultipleBadges(userId, badgesToCheck);
      if (newlyUnlocked.length > 0) {
        console.log(`✅ New badges unlocked: ${newlyUnlocked.join(', ')}`);
      }
    } catch (err) {
      console.error(`❌ Failed to award improvement bonus for user ${userId}:`, err.message);
    }
  } else if (!passed) {
    // Did not pass - no XP/tokens awarded
    console.log(`ℹ️ Quiz not passed (${newTotal} correct, need >12): no rewards for user ${userId}`);
  }

  // Refetch and return updated document
  progress = await Progress.findOne({ userId, career });
  return progress;
};

// Get user progress for a specific career
export const getProgressByUserId = async (userId, career) => {
  let progress = await Progress.findOne({ userId, career });

  if (!progress) {
    progress = await Progress.create({ userId, career, chapters: [] });
  }

  return progress;
};

// Reset progress for a specific career
export const resetProgress = async (userId, career) => {
  const progress = await Progress.findOneAndUpdate(
    { userId, career },
    {
      chapters: [],
      easyScore: 0,
      mediumScore: 0,
      hardScore: 0,
      easyCompleted: false,
      mediumCompleted: false,
      hardCompleted: false,
    },
    { returnDocument: "after", upsert: true }
  );

  return progress;
};

// Check if user can access a difficulty level
export const canAccessDifficulty = async (userId, career, difficulty) => {
  const progress = await getProgressByUserId(userId, career);

  if (difficulty === "Easy") return true;
  if (difficulty === "Medium") return progress.easyCompleted;
  if (difficulty === "Hard") return progress.mediumCompleted;

  return false;
};