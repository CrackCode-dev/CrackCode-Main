// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import connectDB from "./src/config/db.js";
// import redisClient from "./src/modules/leaderboard/redis.config.js";
// import { stripeWebhookController } from "./src/controllers/Shop.controller.js";

// import path from "path";
// import { fileURLToPath } from "url";

// // Routes
// import paymentRoutes from "./src/routes/Payment.routes.js";
// import shopRoutes from "./src/routes/Shop.routes.js";

// import authRoutes from "./src/modules/auth/routes.js";
// import userRoutes from "./src/modules/user/routes.js";
// import profileRoutes from "./src/modules/profile/routes.js";
// import leaderboardRoutes from "./src/modules/leaderboard/routes.js";
// import learnRoutes from "./src/modules/learn/routes.js";
// import gameProfileRoutes from "./src/modules/gameprofile/routes.js";
// import sessionRoutes from "./src/modules/session/routes.js";
// import rewardsRoutes from "./src/modules/rewards/routes.js";
// import codeEditorRoutes from "./src/modules/codeEditor/routes.js";

// // Session cleanup utility
// import { cleanupExpiredSessions } from "./src/modules/session/session.service.js";

// // Career Map Routes
// import questionRoutes from "./src/modules/Career Map/questions/question.routes.js";
// import progressRoutes from "./src/modules/Career Map/progress/progress.routes.js";

// const app = express();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Database
// connectDB();

// // Redis feature flag
// const ENABLE_SESSION_CACHE =
//   (process.env.ENABLE_SESSION_CACHE ?? "true").toString().toLowerCase() !==
//   "false";

// const connectRedisOrExit = async () => {
//   if (!ENABLE_SESSION_CACHE) {
//     console.log("⚠️ Redis cache is disabled via ENABLE_SESSION_CACHE=false");
//     return;
//   }

//   try {
//     await redisClient.connect();
//     console.log("✅ Redis Connected");
//   } catch (err) {
//     console.error(
//       "❌ Redis Connection Error - cannot start server:",
//       err?.message || err
//     );
//     process.exit(1);
//   }
// };

// // Middleware
// app.use(express.json());
// app.use(cookieParser());

// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://127.0.0.1:3000",
//   "http://localhost:3001",
//   "http://127.0.0.1:3001",
//   "http://localhost:5173",
//   "http://localhost:5174",
//   "http://localhost:5177",
//   process.env.CLIENT_URL,
// ].filter(Boolean);

// app.use(
//   cors({
//     origin(origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }
//       return callback(new Error("CORS not allowed"));
//     },
//     credentials: true,
//   })
// );

// // Optional webhook route
// app.post(
//   "/api/payment/webhook",
//   express.raw({ type: "application/json" }),
//   stripeWebhookController
// );

// // Routes
// app.use("/api/payment", paymentRoutes);
// app.use("/api/shop", shopRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/api/leaderboard", leaderboardRoutes);
// app.use("/api/learn", learnRoutes);
// app.use("/api/gameprofile", gameProfileRoutes);
// app.use("/api/game-profile", gameProfileRoutes);
// app.use("/api/session", sessionRoutes);
// app.use("/api/rewards", rewardsRoutes);
// app.use("/api/codeEditor", codeEditorRoutes);

// // Career Map APIs
// app.use("/api/questions", questionRoutes);
// app.use("/api/progress", progressRoutes);

// // Health check
// app.get("/", (_req, res) => {
//   res.send("CrackCode Backend API is Running!");
// });

// // Global error handler
// app.use((err, _req, res, _next) => {
//   console.error("Global Error:", err);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal server error",
//   });
// });

// // Start server
// const PORT = process.env.PORT || 5050;

// const startServer = async () => {
//   await connectRedisOrExit();

//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);

//     setInterval(async () => {
//       try {
//         const count = await cleanupExpiredSessions();
//         if (count > 0) {
//           console.log(`[CRON] Cleaned ${count} expired session(s)`);
//         }
//       } catch (err) {
//         console.error("[CRON] Session cleanup error:", err.message);
//       }
//     }, 60 * 60 * 1000);
//   });
// };

// startServer();

// // Graceful shutdown
// const shutdown = async (signal) => {
//   console.log(`${signal} received. Closing connections...`);

//   if (redisClient?.isOpen) {
//     await redisClient.quit();
//     console.log("Redis disconnected");
//   }

//   process.exit(0);
// };

// process.on("SIGTERM", () => shutdown("SIGTERM"));
// process.on("SIGINT", () => shutdown("SIGINT"));


import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connectDB from "./src/config/db.js";
import redisClient from "./src/modules/leaderboard/redis.config.js";
import { stripeWebhookController } from "./src/controllers/Shop.controller.js";

import path from "path";
import { fileURLToPath } from "url";

// Routes
import paymentRoutes from "./src/routes/Payment.routes.js";
import shopRoutes from "./src/routes/Shop.routes.js";

// AI Routes (ERROR DIAGNOSIS + ASSISTANT)
import aiRoutes from "./src/services/aiRoutes.js";
import { logAIConfig } from "./src/services/aiConfig.js";
import { verifyBrevoApiKey } from "./src/modules/notifications/brevo.client.js";

import authRoutes from "./src/modules/auth/routes.js";
import userRoutes from "./src/modules/user/routes.js";
import profileRoutes from "./src/modules/profile/routes.js";
import leaderboardRoutes from "./src/modules/leaderboard/routes.js";
import learnRoutes from "./src/modules/learn/routes.js";
import gameProfileRoutes from "./src/modules/gameprofile/routes.js";
import sessionRoutes from "./src/modules/session/routes.js";
import rewardsRoutes from "./src/modules/rewards/routes.js";
import codeEditorRoutes from "./src/modules/codeEditor/routes.js";
import badgeRoutes from "./src/modules/badges/routes.js";
import brevoRoutes from "./src/modules/notifications/brevo.routes.js";

// Session cleanup utility
import { cleanupExpiredSessions } from "./src/modules/session/session.service.js";

// Career Map Routes
import questionRoutes from "./src/modules/Career Map/questions/question.routes.js";
import progressRoutes from "./src/modules/Career Map/progress/progress.routes.js";

const app = express();

// If the app is running behind a proxy/load-balancer (nginx, cloud LB),
// enable trust proxy so req.secure and x-forwarded-* headers are populated.
app.set('trust proxy', true);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      "❌ Redis Connection Error:",
      err?.message || err
    );
    console.warn('Continuing without Redis - set ENABLE_SESSION_CACHE=false to silence this warning.');
    // Do not exit in development; allow server to run without Redis
    return;
  }
};

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5177",
  process.env.CLIENT_URL,
  ...(process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(",") : []),
]
  .map((origin) => origin.trim())
  .filter(Boolean);

// Stripe webhook must come BEFORE express.json()
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookController
);

// Middleware
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

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Routes
app.use("/api/payment", paymentRoutes);
app.use("/api/shop", shopRoutes);

// AI Services Routes
app.use("/api/ai", aiRoutes);
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
app.use("/api/badges", badgeRoutes);
app.use("/api/admin/brevo", brevoRoutes);

// Career Map APIs
app.use("/api/questions", questionRoutes);
app.use("/api/progress", progressRoutes);

// CaseLog API - Direct collection fetch
app.get("/api/caseLog", async (_req, res) => {
  try {
    const collectionName = "caseLog";
    const items = await mongoose.connection.db.collection(collectionName).find({}).toArray();
    return res.status(200).json({ success: true, count: items.length, collectionName, data: items });
  } catch (error) {
    console.error("❌ caseLog fetch error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Health check endpoint for Docker/load balancer
app.get("/health", async (_req, res) => {
  try {
    const mongooseHealthy = mongoose.connection.readyState === 1;
    const redisHealthy = ENABLE_SESSION_CACHE ? redisClient?.isOpen : true;
    
    if (!mongooseHealthy || !redisHealthy) {
      return res.status(503).json({
        success: false,
        message: `Unhealthy: MongoDB=${mongooseHealthy}, Redis=${redisHealthy}`,
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: "All services healthy",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Root endpoint
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
  // Validate essential env vars
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing env vars: ${missing.join(', ')}`);
    process.exit(1);
  }
  
  // Check AI key if enabled
  if (process.env.ENABLE_AI_AGENT === 'true' && !process.env.GEMINI_API_KEY) {
    console.error('❌ AI enabled but GEMINI_API_KEY missing in .env');
    process.exit(1);
  }

  // Check Brevo connectivity and log status
  try {
    const brevoOk = await verifyBrevoApiKey();
    if (brevoOk) {
      console.log('✅ Brevo API reachable');
    } else if (process.env.BREVO_API_KEY) {
      console.warn('⚠️ BREVO_API_KEY set but Brevo API did not respond (check key/network)');
    } else {
      console.warn('⚠️ BREVO_API_KEY not configured. Email sending will be disabled.');
    }
  } catch (err) {
    console.warn('⚠️ Could not verify Brevo API:', err?.message || err);
  }
  
  await connectRedisOrExit();
  
  // Log AI Services configuration
  logAIConfig();

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

// ====================
// GRACEFUL SHUTDOWN
// ====================

const shutdown = async (signal) => {
  console.log(`${signal} received. Closing connections...`);

  // Close Redis
  if (redisClient?.isOpen) {
    try {
      await redisClient.quit();
      console.log("✅ Redis disconnected");
    } catch (err) {
      console.error("❌ Redis disconnect error:", err.message);
    }
  }

  // Close MongoDB
  if (mongoose.connection.readyState === 1) {
    try {
      await mongoose.disconnect();
      console.log("✅ MongoDB disconnected");
    } catch (err) {
      console.error("❌ MongoDB disconnect error:", err.message);
    }
  }

  console.log("🛑 Server shutting down gracefully");
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// =====================================
// UNHANDLED ERRORS - FAIL FAST
// =====================================

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ UNHANDLED REJECTION:", reason);
  console.error("Promise:", promise);
  // Exit to let container orchestrator restart
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("❌ UNCAUGHT EXCEPTION:", error);
  // Exit to let container orchestrator restart
  process.exit(1);
});

