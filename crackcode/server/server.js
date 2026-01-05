// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import { createClient } from "redis";
import connectDB from "./src/config/db.js";

// Load env variables
dotenv.config({ path: path.resolve(".env") });

// Import routes
import profileRoutes from "./src/routes/profileRoutes.js";
import statisticsRoutes from "./src/routes/statisticsRoutes.js";
import achievementRoutes from "./src/routes/achievementRoutes.js";
import authRouter from "./src/routes/authRoutes.js";
import leaderboardRoutes from "./src/routes/leaderboardRoutes.js";

const app = express();

// Middleware
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); // static uploads

// Health / test routes
app.get("/", (req, res) => res.send("CrackCode Backend API is Running!"));
app.get("/test", (req, res) => res.send("Server is working!"));
app.get("/api/users/test", (_req, res) => res.send("profile routes working"));

// Routes
app.use("/api/users", profileRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/auth", authRouter);
app.use("/api/leaderboard", leaderboardRoutes);

// Start server inside async function
const startServer = async () => {
  try {
    // MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env");
    }
    await connectDB();
    console.log("✅ MongoDB connected");

    // Redis
    const redisClient = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
    redisClient.on("error", (err) => console.error("❌ Redis Client Error:", err));
    redisClient.on("connect", () => console.log("✅ Redis Client Connected"));
    await redisClient.connect();

    // Start Express
    const PORT = process.env.PORT || 5051;
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Server failed to start:", err.message);
    process.exit(1);
  }
};

// Start server
startServer();
