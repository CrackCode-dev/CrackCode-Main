import User from "../../models/auth/user.js";
import Achievement from "./Achievement.model.js";

// Unlock an achievement for a user
export const unlockAchievement = async (userId, achievementKey) => {
  try {
    const user = await User.findById(userId);
    if (!user) return { success: false, message: "User not found" };

    const achievement = await Achievement.findOne({ key: achievementKey });
    if (!achievement) return { success: false, message: "Achievement not found" };

    const alreadyUnlocked = user.achievements.some(
      (a) => a.achievement.toString() === achievement._id.toString()
    );

    if (alreadyUnlocked) {
      return { success: false, message: "Achievement already unlocked" };
    }

    user.achievements.push({ achievement: achievement._id });
    await user.save();

    return { success: true, achievement };
  } catch (error) {
    console.error("Error unlocking achievement:", error);
    return { success: false, message: error.message };
  }
};

// Get all achievements for the logged-in user
export const getUserAchievements = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId).populate("achievements.achievement");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(currentUser.achievements || []);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all available achievements (for display)
export const getAllAchievements = async (_req, res) => {
  try {
    const achievements = await Achievement.find();
    return res.status(200).json(achievements);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
