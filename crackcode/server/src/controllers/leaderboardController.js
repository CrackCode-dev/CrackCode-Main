import User from '../models/user.js';
import redisClient from '../config/redis.js'; 

// 1. Get Top 10 Players for the Leaderboard Page
export const getGlobalLeaderboard = async (req, res) => {
    try {
        const topPlayers = await redisClient.zRangeWithScores('global_leaderboard', 0, 9, {
            REV: true
        });

        if (topPlayers.length === 0) {
            const users = await User.find().sort({ totalXP: -1 }).limit(10);
            for (let user of users) {
                await redisClient.zAdd('global_leaderboard', {
                    score: user.totalXP,
                    value: user.username
                });
            }
            return res.status(200).json(users);
        }

        res.status(200).json(topPlayers);
    } catch (error) {
        console.error("Leaderboard Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 2. Get the specific Rank of the logged-in user
export const getMyRank = async (req, res) => {
    try {
        const { username } = req.user; // from auth middleware

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
