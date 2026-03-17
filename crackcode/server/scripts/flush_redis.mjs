import redisClient from "../src/modules/leaderboard/redis.config.js";

async function flushRedis() {
  try {
    await redisClient.connect();

    console.log("✅ Connected to Redis");

    await redisClient.flushAll();

    console.log("🧹 Redis database cleared (all keys removed)");

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to clear Redis:", error);
    process.exit(1);
  }
}

flushRedis();