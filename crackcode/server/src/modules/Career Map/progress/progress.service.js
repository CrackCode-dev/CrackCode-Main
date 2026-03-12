import Progress from "./progress.model.js";

export const updateProgress = async (userId, difficulty, correct) => {

  let progress = await Progress.findOne({ userId });

  if (!progress) {
    progress = await Progress.create({ userId });
  }

  if (correct) {

    if (difficulty === "Easy") {
      progress.easyScore += 1;
    }

    if (difficulty === "Medium") {
      progress.mediumScore += 1;
    }

    if (difficulty === "Hard") {
      progress.hardScore += 1;
    }

  }

  if (progress.easyScore >= 3) {
    progress.easyCompleted = true;
  }

  if (progress.mediumScore >= 3) {
    progress.mediumCompleted = true;
  }

  await progress.save();

};
