import Progress from "./progress.model.js";

// Get user progress
export const getProgress = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    let progress = await Progress.findOne({ userId });

    if (!progress) {
      progress = await Progress.create({ userId });
    }

    res.json({
      success: true,
      data: progress
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update progress when answer is correct
export const updateUserProgress = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { difficulty, correct } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    let progress = await Progress.findOne({ userId });

    if (!progress) {
      progress = await Progress.create({ userId });
    }

    if (correct) {
      if (difficulty === "Easy") {
        progress.easyScore += 1;
      } else if (difficulty === "Medium") {
        progress.mediumScore += 1;
      } else if (difficulty === "Hard") {
        progress.hardScore += 1;
      }
    }

    // Check completion (5 questions per difficulty)
    if (progress.easyScore >= 5) progress.easyCompleted = true;
    if (progress.mediumScore >= 5) progress.mediumCompleted = true;
    if (progress.hardScore >= 5) progress.hardCompleted = true;

    await progress.save();

    res.json({
      success: true,
      data: progress
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reset progress
export const resetProgress = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

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

    res.json({
      success: true,
      message: "Progress reset successfully",
      data: progress
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
