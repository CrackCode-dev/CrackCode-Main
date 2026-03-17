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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/learn', learnRoutes);
app.use('/api/gameprofile', gameProfileRoutes);
app.use('/api/game-profile', gameProfileRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/codeEditor', codeEditorRoutes);

// Health check
app.get('/', (_req, res) => {
  res.send('CrackCode Backend API is Running!');
});

// Redis health endpoint: returns PONG when Redis is reachable.
app.get('/health/redis', async (_req, res) => {
  try {
    if (!ENABLE_SESSION_CACHE) {
      return res.json({ success: true, message: 'Redis cache disabled by configuration' });
    }

    if (!redisClient || !redisClient.isOpen) {
      return res.status(503).json({ success: false, message: 'Redis not connected' });
    }

    const pong = await redisClient.ping();
    return res.json({ success: true, message: pong });
  } catch (err) {
    return res.status(503).json({ success: false, message: 'Redis ping failed', error: err?.message || err });
  }
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Global Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start server after Redis is connected
const PORT = process.env.PORT || 5050;
const start = async () => {
  await connectRedisOrExit();
  
  // Initialize session module and check Redis health
  const sessionInitResult = await initializeSessionModule();
  console.log(`[Session] ${sessionInitResult.message}`);

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

start();