import User from "../auth/User.model.js";
import redisClient from "./redis.config.js";

const isRedisReady = () => redisClient.isOpen;

/**
 * Get Top 10 Players for the Leaderboard
 */
export const getGlobalLeaderboard = async (_req, res) => {
  try {
    // Try Redis first, but safely fall through to MongoDB on any error
    if (isRedisReady()) {
      try {
        // Use ZREVRANGE (compatible with all redis v4 versions)
        const topPlayers = await redisClient.zRangeWithScores(
          "global_leaderboard",
          "+inf", "-inf",
          { BY: "SCORE", REV: true, LIMIT: { offset: 0, count: 10 } }
        );

        if (topPlayers && topPlayers.length > 0) {
          const leaderboard = topPlayers.map((player, index) => ({
            position: index + 1,
            username: player.value,
            totalXP: player.score,
            rank: "Rookie",
            avatar: null,
          }));
          return res.status(200).json({ success: true, source: "cache", leaderboard });
        }
      } catch (redisErr) {
        console.warn("⚠️ Redis leaderboard fetch failed, using MongoDB:", redisErr.message);
      }
    }

    // MongoDB fallback
    const topPlayers = await User.find({ username: { $exists: true, $ne: null } })
      .sort({ totalXP: -1 })
      .limit(10)
      .select("username totalXP rank avatar");

    const leaderboard = topPlayers.map((player, index) => ({
      position: index + 1,
      username: player.username,
      totalXP: player.totalXP || 0,
      rank: player.rank || "Rookie",
      avatar: player.avatar || null,
    }));

    return res.status(200).json({ success: true, source: "database", leaderboard });

  } catch (error) {
    console.error("Leaderboard Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch leaderboard" });
  }
};

/**
 * Get the specific Rank of the logged-in user
 */
export const getMyRank = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("username totalXP rank");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let position = null;

    if (isRedisReady()) {
      try {
        const rank = await redisClient.zRevRank("global_leaderboard", user.username);
        if (rank !== null) position = rank + 1;
      } catch (redisErr) {
        console.warn("⚠️ Redis rank fetch failed:", redisErr.message);
      }
    }

    if (position === null) {
      const usersAhead = await User.countDocuments({
        totalXP: { $gt: user.totalXP || 0 },
        username: { $exists: true, $ne: null },
      });
      position = usersAhead + 1;
    }

    return res.status(200).json({
      success: true,
      position,
      username: user.username,
      totalXP: user.totalXP || 0,
      rank: user.rank || "Rookie",
    });
  } catch (error) {
    console.error("Error fetching user rank:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch rank" });
  }
};

/**
 * Get leaderboard with pagination
 */
export const getPaginatedLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // MongoDB pagination (skip Redis for paginated to keep it simple)
    const [players, total] = await Promise.all([
      User.find({ username: { $exists: true, $ne: null } })
        .sort({ totalXP: -1 })
        .skip(skip)
        .limit(limit)
        .select("username totalXP rank avatar"),
      User.countDocuments({ username: { $exists: true, $ne: null } }),
    ]);

    const leaderboard = players.map((player, index) => ({
      position: skip + index + 1,
      username: player.username,
      totalXP: player.totalXP || 0,
      rank: player.rank || "Rookie",
      avatar: player.avatar || null,
    }));

    return res.status(200).json({
      success: true,
      source: "database",
      leaderboard,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Paginated Leaderboard Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch leaderboard" });
  }
};
