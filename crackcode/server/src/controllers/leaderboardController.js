const User = require('../models/user');
const redisClient = require('../config/redis');

exports.getGlobalLeaderboard = async (req, res) => {
  try {
    // Get ranked users from Redis
    const leaderboard = await redisClient.zRangeWithScores(
      'global_leaderboard',
      0,
      9,
      { REV: true }
    );

    const usernames = leaderboard.map(item => item.value);

    // Fetch extra details from MongoDB
    const users = await User.find(
      { username: { $in: usernames } },
      { _id: 0, username: 1, level: 1, batch: 1, lastActive: 1 }
    );

    // Map users by username for fast lookup
    const userMap = {};
    users.forEach(user => {
      userMap[user.username] = user;
    });

    // Helper to determine level badge
    const getLevelBadge = (level) => {
      if (level > 50) return "🥇 Gold";
      if (level > 25) return "🥈 Silver";
      return "🥉 Bronze";
    };

    // Build final ranked response
    const response = leaderboard.map((item, index) => ({
      rank: index + 1,
      username: item.value,
      totalXP: Number(item.score),
      level: userMap[item.value]?.level ?? 0,
      badge: getLevelBadge(userMap[item.value]?.level || 0),
      lastActive: userMap[item.value]?.lastActive ?? null
    }));

    return res.json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
};
