import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';
import redisClient from './src/modules/leaderboard/redis.config.js';

// Routes
import authRoutes from './src/modules/auth/routes.js';
import userRoutes from './src/modules/user/routes.js';
import profileRoutes from './src/modules/profile/routes.js';
import leaderboardRoutes from './src/modules/leaderboard/routes.js';
import learnRoutes from './src/modules/learn/routes.js';
import gameProfileRoutes from './src/modules/gameprofile/routes.js';
import sessionRoutes from './src/modules/session/routes.js';
import shopRoutes from './src/modules/shop/routes.js';
import rewardsRoutes from './src/modules/rewards/routes.js';
import codeEditorRoutes from './src/modules/codeEditor/routes.js';
import { initializeSessionModule } from './src/modules/session/session.service.js';

// Career Map Routes
import questionRoutes from './src/modules/Career Map/questions/question.routes.js';
import progressRoutes from './src/modules/Career Map/progress/progress.routes.js';

const app = express();

// Database
connectDB();

// Redis: connect before starting the HTTP server.
// If Redis connection fails at startup we log a clear error and exit the process.
// Feature flag: allow disabling Redis cache in environments where Redis is optional.
const ENABLE_SESSION_CACHE = (process.env.ENABLE_SESSION_CACHE ?? 'true').toString().toLowerCase() !== 'false';

const connectRedisOrExit = async () => {
  if (!ENABLE_SESSION_CACHE) {
    console.log('⚠️ Redis cache is disabled via ENABLE_SESSION_CACHE=false');
    return;
  }

  try {
    await redisClient.connect();
    console.log('✅ Redis Connected');
  } catch (err) {
    console.error('❌ Redis Connection Error - cannot start server:', err?.message || err);
    // Exit so the platform (or developer) notices the misconfiguration immediately.
    process.exit(1);
  }
};

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5177',
    ],
    credentials: true,
  })
);

// ─── Routes ───────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/learn', learnRoutes);

app.use('/api/gameprofile', gameProfileRoutes);
app.use('/api/game-profile', gameProfileRoutes); // alias

app.use('/api/session', sessionRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/codeEditor', codeEditorRoutes);

// Career Map APIs
app.use('/api/questions', questionRoutes);
app.use('/api/progress', progressRoutes);

// Health check
app.get('/', (_req, res) => {
  res.send('CrackCode Backend API is Running!');
});

// ─── Global Error Handler ─────────────────────────────

app.use((err, _req, res, _next) => {
  console.error('Global Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ─── Start Server ─────────────────────────────────────

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
