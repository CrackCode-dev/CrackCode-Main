const User = require('../models/user');
const redisClient = require('../config/redis');

// 1. Get Top 10 Players
exports.getGlobalLeaderboard = async (req, res) => {
  try {
    // Get top 10 from Redis (highest XP first)
    const redisPlayers = await redisClient.zRangeWithScores(
      'global_leaderboard',
      0,
      9,
      { REV: true }
    );

    // If Redis has data
    if (redisPlayers.length > 0) {
      const formatted = redisPlayers.map((player, index) => ({
        rank: index + 1,
        username: player.value,
        totalXP: player.score
      }));

      return res.status(200).json(formatted);
    }

    // ❗ Redis empty → fetch from MongoDB
    const users = await User.find()
      .sort({ totalXP: -1 })
      .limit(10)
      .select('username totalXP level experience lastActive -_id');

    // Seed Redis
    for (const user of users) {
      await redisClient.zAdd('global_leaderboard', {
        score: user.totalXP,
        value: user.username
      });
    }

    // Add ranking
    const rankedUsers = users.map((user, index) => ({
      rank: index + 1,
      ...user.toObject()
    }));

    res.status(200).json(rankedUsers);
  } catch (error) {
    console.error("Leaderboard Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
