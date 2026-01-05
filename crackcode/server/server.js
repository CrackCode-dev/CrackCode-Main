// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import { createClient } from "redis";
import connectDB from "./src/config/db.js";

// ===== LOAD ENVIRONMENT VARIABLES =====
dotenv.config({ path: path.resolve(".env") }); // loads .env from same folder

// ===== IMPORT ROUTES =====
import profileRoutes from "./src/routes/profileRoutes.js";
import statisticsRoutes from "./src/routes/statisticsRoutes.js";
import achievementRoutes from "./src/routes/achievementRoutes.js";
import authRouter from "./src/routes/authRoutes.js";
import leaderboardRoutes from "./src/routes/leaderboardRoutes.js";

// ===== INITIALIZE EXPRESS =====
const app = express();

// ===== MIDDLEWARE =====
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json());
app.use(cookieParser());

// ===== HEALTH CHECK =====
app.get("/", (req, res) => res.send("CrackCode Backend API is Running!"));

// ===== ROUTES =====
app.use("/api/users", profileRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/auth", authRouter);
app.use("/api/leaderboard", leaderboardRoutes);

// ===== DATABASE CONNECTION =====
const startServer = async () => {
  try {
    // --- MongoDB ---
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env");
    }
    await connectDB();
    console.log("✅ MongoDB connected");

    // --- Redis ---
    if (!process.env.REDIS_URL) {
      console.warn("⚠️ REDIS_URL missing in .env. Using default localhost.");
      process.env.REDIS_URL = "redis://localhost:6379";
    }

    const redisClient = createClient({ url: process.env.REDIS_URL });

    redisClient.on("error", (err) =>
      console.error("❌ Redis Client Error:", err)
    );
    redisClient.on("connect", () => console.log("✅ Redis Client Connected"));

    await redisClient.connect();

    // --- Start Express server ---
    const PORT = process.env.PORT || 5051;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Server failed to start:", err.message);
    process.exit(1);
  }
};

// ===== START SERVER =====
startServer();
