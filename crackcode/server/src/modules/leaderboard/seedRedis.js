import mongoose from "mongoose";
import redisClient from "./redis.config.js";
import User from "../auth/User.model.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const seedLeaderboard = async () => {
  try {
    console.log("Connecting to databases...");
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    
    // Check if redis is already open (from config), otherwise connect
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }

    console.log("Fetching users from MongoDB...");
    const users = await User.find({ username: { $exists: true, $ne: null } });
    
    if (users.length === 0) {
      console.log("⚠️ No users found in MongoDB to seed.");
      process.exit(0);
    }

    console.log(`Seeding ${users.length} users into Redis...`);

    // Use a pipeline for performance if you have many users
    const pipeline = redisClient.multi();
    
    for (const user of users) {
      pipeline.zAdd("global_leaderboard", { 
        score: user.totalXP || 0, 
        value: user.username 
      });
    }

    await pipeline.exec();

    console.log("✅ Leaderboard seeded to Redis successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding leaderboard:", error);
    process.exit(1);
  }
};

seedLeaderboard();
