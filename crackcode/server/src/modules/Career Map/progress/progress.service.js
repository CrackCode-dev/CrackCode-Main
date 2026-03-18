import Progress from "./progress.model.js";

// Helper — recompute overall totals from all chapters
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

  // Find existing progress document for this user + career
  let progress = await Progress.findOne({ userId, career });

  // Create new progress document if doesn't exist
  if (!progress) {
    progress = await Progress.create({ userId, career, chapters: [] });
  }

  // Check if this chapter has been attempted before
  const existingIndex = progress.chapters.findIndex(ch => ch.chapterId === chapterId);

  if (existingIndex >= 0) {
    // Chapter exists — update scores using MongoDB $set to avoid Mongoose array issues
    await Progress.updateOne(
      { userId, career, "chapters.chapterId": chapterId },
      {
        $set: {
          "chapters.$.easyScore": easyScore,
          "chapters.$.mediumScore": mediumScore,
          "chapters.$.hardScore": hardScore,
          "chapters.$.passed": passed,
        },
        // Increment attempts count
        $inc: { "chapters.$.attempts": 1 }
      }
    );
  } else {
    // Chapter doesn't exist — push new chapter entry into array
    await Progress.updateOne(
      { userId, career },
      { $push: { chapters: { chapterId, easyScore, mediumScore, hardScore, passed, attempts: 1 } } }
    );
  }

  // Refetch updated document so totals are computed from latest data
  progress = await Progress.findOne({ userId, career });

  // Recompute overall totals from all chapters
  const totals = recomputeTotals(progress.chapters);

  // Use findOneAndUpdate to avoid __v version conflicts on save
  progress = await Progress.findOneAndUpdate(
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
    { new: true }
  );

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
    { new: true, upsert: true }
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