const User = require('../models/user');
const redisClient = require('../config/redis');

exports.getGlobalLeaderboard = async (req, res) => {
  console.log('🧠 USERS FROM MONGO:', users);
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

    // Build final ranked response
    const response = leaderboard.map((item, index) => ({
      rank: index + 1,
      username: item.value,
      totalXP: Number(item.score),
      level: userMap[item.value]?.level ?? 0,
      batch: userMap[item.value]?.batch ?? "Bronze",
      lastActive: userMap[item.value]?.lastActive ?? null
    }));

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
};
