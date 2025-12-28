// controllers/leaderboardController.js
const User = require('../models/User'); // Assuming you have a User model
const redis = require('../config/redis'); // Your Redis connection setup

exports.getGlobalLeaderboard = async (req, res) => {
    try {
        // 1. Try to get data from Redis first (very fast)
        const topPlayers = await redis.zrevrange('leaderboard:global', 0, 9, 'WITHSCORES');
        
        if (topPlayers.length > 0) {
            return res.status(200).json({ source: 'cache', data: topPlayers });
        }

        // 2. Fallback: If Redis is empty, fetch from MongoDB and seed Redis
        const players = await User.find().sort({ totalXP: -1 }).limit(10);
        // (Logic to push this data to Redis would go here)
        
        res.status(200).json({ source: 'db', data: players });
    } catch (error) {
        res.status(500).json({ message: "Error fetching leaderboard", error });
    }
};