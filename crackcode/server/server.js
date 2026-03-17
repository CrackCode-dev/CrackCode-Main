import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import redisClient from "./src/modules/leaderboard/redis.config.js";
import { stripeWebhookController } from "./src/controllers/Shop.controller.js";

// Routes
import paymentRoutes from "./src/routes/Payment.routes.js";
import shopRoutes from "./src/routes/Shop.routes.js";

import authRoutes from "./src/modules/auth/routes.js";
import userRoutes from "./src/modules/user/routes.js";
import profileRoutes from "./src/modules/profile/routes.js";
import leaderboardRoutes from "./src/modules/leaderboard/routes.js";
import learnRoutes from "./src/modules/learn/routes.js";
import gameProfileRoutes from "./src/modules/gameprofile/routes.js";
import sessionRoutes from "./src/modules/session/routes.js";
import rewardsRoutes from "./src/modules/rewards/routes.js";
import codeEditorRoutes from "./src/modules/codeEditor/routes.js";

// Session cleanup utility
import { cleanupExpiredSessions } from "./src/modules/session/session.service.js";

// Career Map Routes
import questionRoutes from "./src/modules/Career Map/questions/question.routes.js";
import progressRoutes from "./src/modules/Career Map/progress/progress.routes.js";

const app = express();

// Database
connectDB();

// Redis feature flag
const ENABLE_SESSION_CACHE =
  (process.env.ENABLE_SESSION_CACHE ?? "true").toString().toLowerCase() !==
  "false";

const connectRedisOrExit = async () => {
  if (!ENABLE_SESSION_CACHE) {
    console.log("⚠️ Redis cache is disabled via ENABLE_SESSION_CACHE=false");
    return;
  }

  try {
    await redisClient.connect();
    console.log("✅ Redis Connected");
  } catch (err) {
    console.error(
      "❌ Redis Connection Error - cannot start server:",
      err?.message || err
    );
    process.exit(1);
  }
};

// Middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5177",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);

// Optional webhook route
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookController
);

// Routes
app.use("/api/payment", paymentRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/learn", learnRoutes);
app.use("/api/gameprofile", gameProfileRoutes);
app.use("/api/game-profile", gameProfileRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/codeEditor", codeEditorRoutes);

// Career Map APIs
app.use("/api/questions", questionRoutes);
app.use("/api/progress", progressRoutes);

// Health check
app.get("/", (_req, res) => {
  res.send("CrackCode Backend API is Running!");
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Global Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 5050;

const startServer = async () => {
  await connectRedisOrExit();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);

    setInterval(async () => {
      try {
        const count = await cleanupExpiredSessions();
        if (count > 0) {
          console.log(`[CRON] Cleaned ${count} expired session(s)`);
        }
      } catch (err) {
        console.error("[CRON] Session cleanup error:", err.message);
      }
    }, 60 * 60 * 1000);
  });
};

startServer();

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`${signal} received. Closing connections...`);

  if (redisClient?.isOpen) {
    await redisClient.quit();
    console.log("Redis disconnected");
  }

  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));