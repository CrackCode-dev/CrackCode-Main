import UserProgress from "./UserProgress.model.js";
import Question from "./Question.model.js";
import User from "../auth/User.model.js";
import { checkAndUnlockMultipleBadges } from "../badges/badge.service.js";

// Get user's progress on all questions
export const getUserProgress = async (req, res) => {
  try {
    const userId = req.userId;

    const progress = await UserProgress.find({ userId }).populate("questionId");
    return res.status(200).json(progress);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update progress for a question
export const updateProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { questionId, status } = req.body;

    // detect previous state to know if this is a new completion
    const existing = await UserProgress.findOne({ userId, questionId });

    const progress = await UserProgress.findOneAndUpdate(
      { userId, questionId },
      {
        status,
        $inc: { attempts: 1 },
        ...(status === "completed" && { completedAt: new Date() }),
      },
      { upsert: true, returnDocument: "after" }
    );

    // If newly completed, increment aggregated counters on User doc
    if (status === "completed" && (!existing || existing.status !== "completed")) {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $inc: { casesSolved: 1 }, $set: { lastActive: new Date() } },
          { returnDocument: "after" }
        ).select("casesSolved currentStreak achievements unlockedBadges");

        // Check and unlock badges based on new casesSolved count
        let newlyUnlocked = [];
        try {
          const badgesToCheck = ['beginner', 'cases_5', 'cases_10', 'cases_25'];
          newlyUnlocked = await checkAndUnlockMultipleBadges(userId.toString(), badgesToCheck);
          if (newlyUnlocked.length > 0) {
            console.log(`✅ New badges unlocked: ${newlyUnlocked.join(', ')}`);
          }
        } catch (badgeErr) {
          console.error('⚠️ Badge unlock error:', badgeErr.message);
        }

        return res.status(200).json({ 
          progress, 
          userStats: {
            casesSolved: updatedUser?.casesSolved ?? 0,
            currentStreak: updatedUser?.currentStreak ?? 0,
            badgesEarned: Array.isArray(updatedUser?.achievements) ? updatedUser.achievements.length : 0
          },
          badgesUnlocked: newlyUnlocked
        });
      } catch (err) {
        console.error("Failed updating aggregated user stats:", err);
        return res.status(200).json({ progress });
      }
    }

    return res.status(200).json(progress);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get roadmap with progress
export const getRoadmap = async (req, res) => {
  try {
    const userId = req.userId;

    const questions = await Question.find().sort({ difficulty: 1 });
    const progress = await UserProgress.find({ userId });

    const progressMap = {};
    progress.forEach((p) => {
      progressMap[p.questionId.toString()] = p.status;
    });

    const roadmap = questions.map((q) => ({
      ...q.toObject(),
      status: progressMap[q._id.toString()] || "not_started",
    }));

    return res.status(200).json(roadmap);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
