import Progress from "./progress.model.js";
import User from "../../auth/User.model.js";

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

  // Award XP based on first-time or retry pass
  if (passed) {
    const xp = previouslyPassed ? 5 : 10;
    try {
      await User.findByIdAndUpdate(userId, {
        $inc: { totalXP: xp }
      });
      console.log(`✅ Chapter ${previouslyPassed ? 'retry' : 'first'} pass: +${xp} XP to user ${userId} for ${career}/${chapterId}`);
    } catch (err) {
      console.error(`❌ Failed to award chapter XP:`, err.message);
    }
  }

  // Award 1 token when all 4 chapters passed for the first time
  progress = await Progress.findOne({ userId, career });
  const allChaptersPassed = progress.chapters.length === 4 &&
    progress.chapters.every(ch => ch.passed);

  if (allChaptersPassed && !progress.careerRewarded) {
    try {
      await User.findByIdAndUpdate(userId, {
        $inc: { tokens: 1 }
      });
      await Progress.updateOne(
        { userId, career },
        { $set: { careerRewarded: true } }
      );
      console.log(`✅ Career complete: +1 token to user ${userId} for ${career}`);
    } catch (err) {
      console.error(`❌ Failed to award career token:`, err.message);
    }
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