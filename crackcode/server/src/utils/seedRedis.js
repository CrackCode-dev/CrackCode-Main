const User = require('../models/user');
const redisClient = require('../config/redis');

const syncLeaderboard = async () => {
    const users = await User.find({}, 'username totalXP');
    for (let user of users) {
        // ZADD adds the user to a "Sorted Set" in Redis
        // Syntax: ZADD key score member
        await redisClient.zAdd('global_leaderboard', {
            score: user.totalXP,
            value: user.username 
        });
    }
    console.log("Redis Leaderboard Synced!");
};