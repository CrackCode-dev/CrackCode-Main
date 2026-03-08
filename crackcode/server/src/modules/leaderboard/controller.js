import User from "../auth/User.model.js";
import redisClient from "./redis.config.js";

// Helper function to check if Redis connection is ready
const isRedisReady = () => redisClient.isOpen;

/**
 * Get Top 10 Players for the Leaderboard
 * 
 * Attempts to fetch from Redis cache first for performance.
 * Falls back to MongoDB if Redis is unavailable or fails.
 * 
 * @returns {Object} - Top 10 players with position, username, totalXP, rank, avatar
 */
export const getGlobalLeaderboard = async (_req, res) => {
  try {
    // Try Redis first, but safely fall through to MongoDB on any error
    if (isRedisReady()) {
      try {
        // Fetch top 10 players from Redis sorted set
        // Using index-based range: 0-9 = top 10 players
        // REV: true = descending order (highest XP first)
        const topPlayers = await redisClient.zRangeWithScores(
          "global_leaderboard",
          0,
          9,
          { REV: true }
        );

        // If Redis has data, format and return it
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
        // Log Redis error but continue to MongoDB fallback
        console.warn("⚠️ Redis leaderboard fetch failed, using MongoDB:", redisErr.message);
      }
    }

    // MongoDB fallback - query database directly
    const topPlayers = await User.find({ username: { $exists: true, $ne: null } })
      .sort({ totalXP: -1 })
      .limit(10)
      .select("username totalXP rank avatar");

    // Format the MongoDB results
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
 * 
 * Finds the authenticated user's position on the leaderboard.
 * Uses Redis if available, otherwise calculates from MongoDB.
 * 
 * @requires Authentication - req.userId must be set by auth middleware
 * @returns {Object} - User's position, username, totalXP, and rank
 */
export const getMyRank = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.userId;
    
    // Fetch user details from database
    const user = await User.findById(userId).select("username totalXP rank");

    // Return 404 if user doesn't exist
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let position = null;

    // Try to get rank from Redis first
    if (isRedisReady()) {
      try {
        // zRevRank returns 0-based index (0 = highest score)
        const rank = await redisClient.zRevRank("global_leaderboard", user.username);
        if (rank !== null) position = rank + 1; // Convert to 1-based position
      } catch (redisErr) {
        console.warn("⚠️ Redis rank fetch failed:", redisErr.message);
      }
    }

    // MongoDB fallback - count users with higher XP
    if (position === null) {
      const usersAhead = await User.countDocuments({
        totalXP: { $gt: user.totalXP || 0 },
        username: { $exists: true, $ne: null },
      });
      position = usersAhead + 1; // Position = users ahead + 1
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
 * 
 * Fetches leaderboard data with pagination support for displaying
 * large lists of players. Uses MongoDB directly for simplicity.
 * 
 * @param {number} req.query.page - Page number (default: 1)
 * @param {number} req.query.limit - Results per page (default: 20)
 * @returns {Object} - Paginated leaderboard with player data and pagination info
 */
export const getPaginatedLeaderboard = async (req, res) => {
  try {
    // Parse pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit; // Calculate documents to skip

    // Fetch players and total count in parallel for efficiency
    const [players, total] = await Promise.all([
      User.find({ username: { $exists: true, $ne: null } })
        .sort({ totalXP: -1 })
        .skip(skip)
        .limit(limit)
        .select("username totalXP rank avatar"),
      User.countDocuments({ username: { $exists: true, $ne: null } }),
    ]);

    // Format results with correct positions based on pagination
    const leaderboard = players.map((player, index) => ({
      position: skip + index + 1, // Account for skipped pages
      username: player.username,
      totalXP: player.totalXP || 0,
      rank: player.rank || "Rookie",
      avatar: player.avatar || null,
    }));

    return res.status(200).json({
      success: true,
      source: "database",
      leaderboard,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit), // Total number of pages
      },
    });
  } catch (error) {
    console.error("Paginated Leaderboard Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch leaderboard" });
  }
};