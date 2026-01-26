import User from "../auth/User.model.js";
import redisClient from "./redis.config.js";

// Get Top 10 Players for the Leaderboard Page
export const getGlobalLeaderboard = async (_req, res) => {
  try {
    const topPlayers = await redisClient.zRangeWithScores("global_leaderboard", 0, 9, { REV: true });

    if (!topPlayers || topPlayers.length === 0) {
      const users = await User.find().sort({ totalXP: -1 }).limit(10);
      for (const user of users) {
        // eslint-disable-next-line no-await-in-loop
        await redisClient.zAdd("global_leaderboard", { score: user.totalXP || 0, value: user.username });
      }
      return res.status(200).json(users);
    }

    return res.status(200).json(topPlayers);
  } catch (error) {
    console.error("Leaderboard Error:", error);
    // Fallback to DB if Redis fails
    try {
      const users = await User.find().sort({ totalXP: -1 }).limit(10);
      return res.status(200).json(users);
    } catch (dbError) {
      console.error("Leaderboard DB Error:", dbError);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

// Get the specific Rank of the logged-in user
export const getMyRank = async (req, res) => {
  try {
    const username = req.user?.username;
    if (!username) {
      return res.status(400).json({ message: "Username not available for rank lookup" });
    }

    const rank = await redisClient.zRevRank("global_leaderboard", username);
    const score = await redisClient.zScore("global_leaderboard", username);

    return res.status(200).json({
      rank: rank !== null ? rank + 1 : "Unranked",
      score: score || 0,
    });
  } catch (error) {
    console.error("Error fetching user rank:", error);
    return res.status(500).json({ message: "Error fetching user rank" });
  }
};
