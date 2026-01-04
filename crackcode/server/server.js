import express from "express";
import cors from "cors";
import dotenv from "dotenv";  
dotenv.config();              
import path from "path";
import cookieParser from "cookie-parser";

import connectDB from "./src/config/db.js";
// import redisClient from "./config/redis.js"; // Uncomment if using Redis

import profileRoutes from "./src/routes/profileRoutes.js";
import statisticsRoutes from "./src/routes/statisticsRoutes.js";
import achievementRoutes from "./src/routes/achievementRoutes.js";
import authRouter from "./src/routes/authRoutes.js";
import leaderboardRoutes from "./src/routes/leaderboardRoutes.js";

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json());
app.use(cookieParser());

// ===== HEALTH / TEST ROUTE =====
app.get("/", (req, res) => res.send("CrackCode Backend API is Running!"));
app.get("/api/users/test", (_req, res) => res.send("profile routes working"));

// ===== STATIC UPLOADS =====
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ===== ROUTES =====
app.use("/api/users", profileRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/auth", authRouter);
app.use("/api/leaderboard", leaderboardRoutes);

// ===== DATABASE CONNECTION =====
connectDB()
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error(" MongoDB connection failed:", err.message));

// ===== REDIS CONNECTION =====
// redisClient.connect()
//     .then(() => console.log('✅ Redis Connected'))
//     .catch((err) => console.error('❌ Redis Connection Error:', err));

// ===== START SERVER =====
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

app.get("/test", (req, res) => res.send("Server is working!"));

