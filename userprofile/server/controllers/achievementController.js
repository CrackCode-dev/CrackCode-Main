import User from "../models/user.js";
import Achievement from "../models/Achievement.js";

export const unlockAchievement = async (userId, achievementKey) => {
  const user = await User.findById(userId);
  if (!user) return;

  const achievement = await Achievement.findOne({ key: achievementKey });
  if (!achievement) return;

  const alreadyUnlocked = user.achievements.some(
    (a) => a.achievement.toString() === achievement._id.toString()
  );

  if (alreadyUnlocked) return;

  user.achievements.push({ achievement: achievement._id });
  await user.save();
};
