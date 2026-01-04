import mongoose from "mongoose";
import Achievement from "../models/Achievement.js";
import dotenv from "dotenv";
dotenv.config();

const achievements = [
  {
    key: "first_victory",
    title: "First Victory",
    description: "Won your first case",
    icon: "🏆",
  },
  {
    key: "speed_solver",
    title: "Speed Solver",
    description: "Solved a case in under 5 minutes",
    icon: "⚡",
  },
  {
    key: "streak_master",
    title: "Streak Master",
    description: "7-day win streak",
    icon: "🔥",
  },
  {
    key: "code_master",
    title: "Code Master",
    description: "100% accuracy",
    icon: "🧠",
  },
  {
    key: "rising_star",
    title: "Rising Star",
    description: "Reached Level 10",
    icon: "⭐",
  },
  {
    key: "persistent",
    title: "Persistent",
    description: "Solved 10 cases",
    icon: "🏃",
  },
  {
    key: "focused",
    title: "Focused",
    description: "Perfect score",
    icon: "🎯",
  },
  {
    key: "elite",
    title: "Elite",
    description: "Top 100 rank",
    icon: "👑",
  },
];

const seedAchievements = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Achievement.insertMany(achievements);
  console.log("Achievements seeded");
  process.exit();
};

seedAchievements();
