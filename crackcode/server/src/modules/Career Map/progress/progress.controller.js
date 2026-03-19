import Progress from "./progress.model.js";
import { updateChapterProgress, getProgressByUserId, resetProgress as resetProgressService } from "./progress.service.js";

const VALID_CAREERS = ["MLEngineer", "DataScientist", "SoftwareEngineer"];

// Get user progress for a specific career
// GET /api/progress?career=MLEngineer
export const getProgress = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { career } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    if (!career) {
      return res.status(400).json({
        success: false,
        message: "Career is required (MLEngineer, DataScientist, or SoftwareEngineer)"
      });
    }

    if (!VALID_CAREERS.includes(career)) {
      return res.status(400).json({
        success: false,
        message: `Invalid career. Valid options: ${VALID_CAREERS.join(", ")}`
      });
    }

    let progress = await Progress.findOne({ userId, career });

    if (!progress) {
      progress = await Progress.create({ userId, career, chapters: [] });
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

// Get all progress for a user (all careers)
// GET /api/progress/all
export const getAllProgress = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const progress = await Progress.find({ userId });

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

// Update progress when user finishes a chapter
// POST /api/progress/update
// Body: { career, chapterId, easyScore, mediumScore, hardScore, passed }
export const updateUserProgress = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { career, chapterId, easyScore, mediumScore, hardScore, passed } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!career || !chapterId) {
      return res.status(400).json({ success: false, message: "career and chapterId are required" });
    }

    if (!VALID_CAREERS.includes(career)) {
      return res.status(400).json({ success: false, message: `Invalid career. Valid options: ${VALID_CAREERS.join(", ")}` });
    }

    const progress = await updateChapterProgress(
      userId, career, chapterId,
      easyScore || 0,
      mediumScore || 0,
      hardScore || 0,
      passed || false
    );

    res.json({ success: true, data: progress });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset progress for a specific career
// POST /api/progress/reset
// Body: { career }
export const resetProgress = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { career } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!career) {
      return res.status(400).json({ success: false, message: "Career is required" });
    }

    if (!VALID_CAREERS.includes(career)) {
      return res.status(400).json({ success: false, message: `Invalid career. Valid options: ${VALID_CAREERS.join(", ")}` });
    }

    const progress = await resetProgressService(userId, career);

    res.json({ success: true, message: "Progress reset successfully", data: progress });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
