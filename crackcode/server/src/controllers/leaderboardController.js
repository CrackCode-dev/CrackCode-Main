const User = require('../models/user');
const redisClient = require('../config/redis'); // Assuming your redis config is here

// 1. Get Top 10 Players for the Leaderboard Page
exports.getGlobalLeaderboard = async (req, res) => {
    try {
        // Fetch top 10 from Redis (High to Low)
        // 'global_leaderboard' is the key we use for the Sorted Set
        const topPlayers = await redisClient.zRangeWithScores('global_leaderboard', 0, 9, {
            REV: true
        });

        // If Redis is empty, we need to fetch from MongoDB and seed Redis
        if (topPlayers.length === 0) {
            const users = await User.find().sort({ totalXP: -1 }).limit(10);
            
            // Seed Redis so next time it's fast
            for (let user of users) {
                await redisClient.zAdd('global_leaderboard', {
                    score: user.totalXP,
                    value: user.username
                });
            }
            return res.status(200).json(users);
        }

        // Format the data for the frontend (Podium + List)
        res.status(200).json(topPlayers);
    } catch (error) {
        console.error("Leaderboard Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 2. Get the specific Rank of the logged-in user
exports.getMyRank = async (req, res) => {
    try {
        const { username } = req.user; // Assuming you have auth middleware

        // ZREVRANK gives the 0-based rank from the top
        const rank = await redisClient.zRevRank('global_leaderboard', username);
        const score = await redisClient.zScore('global_leaderboard', username);

        res.status(200).json({
            rank: rank !== null ? rank + 1 : "Unranked",
            score: score || 0
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user rank" });
    }
};
