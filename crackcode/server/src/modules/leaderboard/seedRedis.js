import mongoose from "mongoose";
import redisClient from "./redis.config.js";
import User from "../auth/User.model.js";
import dotenv from "dotenv";
dotenv.config();

const seedLeaderboard = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    await redisClient.connect();

    const users = await User.find().sort({ totalXP: -1 });
    
    for (const user of users) {
      await redisClient.zAdd("global_leaderboard", { 
        score: user.totalXP || 0, 
        value: user.username 
      });
    }

    console.log("✅ Leaderboard seeded to Redis successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding leaderboard:", error);
    process.exit(1);
  }
};

seedLeaderboard();
