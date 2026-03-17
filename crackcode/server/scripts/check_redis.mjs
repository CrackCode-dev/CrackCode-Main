import redisClient from '../src/modules/leaderboard/redis.config.js';

const run = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    const pong = await redisClient.ping();
    console.log('PING ->', pong);
    const keys = await redisClient.keys('*');
    console.log('KEYS count ->', keys.length);
    console.log(keys.slice(0, 20));
    await redisClient.disconnect();
  } catch (err) {
    console.error('Redis check error:', err.message || err);
    process.exit(1);
  }
};

run();
