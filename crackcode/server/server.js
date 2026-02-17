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

const app = express();

// Database
connectDB();

// Redis (optional)
redisClient.connect()
  .then(() => console.log('✅ Redis Connected'))
  .catch((err) =>
    console.warn('⚠️ Redis not connected (running without cache):', err.message)
  );

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/', (_req, res) => {
  res.send('CrackCode Backend API is Running!');
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Global Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
