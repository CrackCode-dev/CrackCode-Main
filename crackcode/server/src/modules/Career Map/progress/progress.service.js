import Progress from "./progress.model.js";

// Update progress when user answers a question
export const updateProgress = async (userId,career, difficulty, correct) => {
  let progress = await Progress.findOne({ userId, career });

  // Create new progress if doesn't exist
  if (!progress) {
    progress = await Progress.create({ userId, career });
  }

  // Only update if answer is correct
  if (correct) {
    if (difficulty === "Easy") {
      progress.easyScore += 1;
    } else if (difficulty === "Medium") {
      progress.mediumScore += 1;
    } else if (difficulty === "Hard") {
      progress.hardScore += 1;
    }
  }

  // Check completion (5 questions per difficulty to complete)
  if (progress.easyScore >= 5) {
    progress.easyCompleted = true;
  }

  if (progress.mediumScore >= 5) {
    progress.mediumCompleted = true;
  }

  if (progress.hardScore >= 5) {
    progress.hardCompleted = true;
  }

  await progress.save();
  return progress;
};

// Get user progress
export const getProgressByUserId = async (userId, career) => {
  let progress = await Progress.findOne({ userId , career });
  
  if (!progress) {
    progress = await Progress.create({ userId, career });
  }
  
  return progress;
};

// Reset user progress
export const resetProgress = async (userId) => {
  const progress = await Progress.findOneAndUpdate(
    { userId },
    {
      easyScore: 0,
      mediumScore: 0,
      hardScore: 0,
      easyCompleted: false,
      mediumCompleted: false,
      hardCompleted: false
    },
    { new: true }
  );
  
  return progress;
};

// Check if user can access a difficulty level
export const canAccessDifficulty = async (userId, difficulty) => {
  const progress = await getProgressByUserId(userId);
  
  if (difficulty === "Easy") {
    return true; // Always can access Easy
  }
  
  if (difficulty === "Medium") {
    return progress.easyCompleted; // Need to complete Easy first
  }
  
  if (difficulty === "Hard") {
    return progress.mediumCompleted; // Need to complete Medium first
  }
  
  return false;
};
