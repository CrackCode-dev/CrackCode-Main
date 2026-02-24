const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { createClient } = require('redis');
const User = require('./src/models/user');

dotenv.config();

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379
  }
});

const seedData = [
  { username: "CodeNinja", totalXP: 1500, level: 10 },
  { username: "BitMaster", totalXP: 2400, level: 15 },
  { username: "DebugQueen", totalXP: 3200, level: 20 },
  { username: "ScriptWizard", totalXP: 1100, level: 8 },
  { username: "LogicKing", totalXP: 2800, level: 18 },
  { username: "SyntaxError", totalXP: 500, level: 3 },
  { username: "JavaJedi", totalXP: 1950, level: 12 },
  { username: "PythonPro", totalXP: 2100, level: 14 },
  { username: "ReactRacer", totalXP: 3500, level: 22 },
  { username: "Hackzilla", totalXP: 900, level: 6 }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await redisClient.connect();
    console.log("✅ Connected to Redis");

    // Optional: clear old data
    await User.deleteMany({});
    await redisClient.del("global_leaderboard");

    // Insert Mongo users
    const users = await User.insertMany(seedData);

    // Insert into Redis leaderboard
    for (const user of users) {
      await redisClient.zAdd("global_leaderboard", [
        { score: user.totalXP, value: user.username }
      ]);
    }

    console.log("🚀 Users seeded in MongoDB and Redis!");
    process.exit();

  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

seedDB();