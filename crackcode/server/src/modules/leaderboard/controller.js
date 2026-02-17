import User from "../auth/User.model.js";
import redisClient from "./redis.config.js";

/**
 * Helper to check if Redis is actually connected and ready
 */
const isRedisReady = () => redisClient.isOpen;

/**
 * Get Top 10 Players for the Leaderboard
 * Logic: Try Redis first (O(log(N))), fallback to MongoDB.
 */
export const getGlobalLeaderboard = async (_req, res) => {
  try {
    if (isRedisReady()) {
      // Fetch top 10 from Redis Sorted Set (High to Low)
      const topPlayers = await redisClient.zRangeWithScores("global_leaderboard", 0, 9, { REV: true });

      if (topPlayers.length > 0) {
        const leaderboard = topPlayers.map((player, index) => ({
          position: index + 1,
          username: player.value,
          totalXP: player.score,
          // Note: If you need avatars/ranks in Redis, you'd store JSON strings 
          // or fetch these specific users from MongoDB here.
        }));

        return res.status(200).json({ success: true, source: "cache", leaderboard });
      }
    }

    // Fallback to MongoDB if Redis is empty or disconnected
    const topPlayers = await User.find({ username: { $exists: true, $ne: null } })
      .sort({ totalXP: -1 })
      .limit(10)
      .select("username totalXP rank avatar");

    const leaderboard = topPlayers.map((player, index) => ({
      position: index + 1,
      username: player.username,
      totalXP: player.totalXP || 0,
      rank: player.rank || "Rookie",
      avatar: player.avatar,
    }));

    return res.status(200).json({ success: true, source: "database", leaderboard });
  } catch (error) {
    console.error("Leaderboard Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch leaderboard" });
  }
};

/**
 * Get the specific Rank of the logged-in user
 * Logic: Redis 'zRevRank' is O(log(N)), whereas MongoDB count is O(N).
 */
export const getMyRank = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const user = await User.findById(userId).select("username totalXP rank");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let position = null;

    if (isRedisReady()) {
      // zRevRank returns 0-based index for highest scores
      const rank = await redisClient.zRevRank("global_leaderboard", user.username);
      if (rank !== null) position = rank + 1;
    }

    // Fallback if Redis rank doesn't exist
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
 * Logic: Uses Redis ZRANGE with offset/limit for efficiency.
 */
export const getPaginatedLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    if (isRedisReady()) {
      const [total, players] = await Promise.all([
        redisClient.zCard("global_leaderboard"),
        redisClient.zRangeWithScores("global_leaderboard", skip, skip + limit - 1, { REV: true })
      ]);

      if (players.length > 0) {
        const leaderboard = players.map((player, index) => ({
          position: skip + index + 1,
          username: player.value,
          totalXP: player.score,
        }));

        return res.status(200).json({
          success: true,
          source: "cache",
          leaderboard,
          pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
      }
    }

    // Fallback to MongoDB pagination
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
      avatar: player.avatar,
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