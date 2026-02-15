import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env variables from server/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';
import redisClient from './src/modules/leaderboard/redis.config.js';

// Import module routes
import authRoutes from './src/modules/auth/routes.js';
import userRoutes from './src/modules/user/routes.js';
import profileRoutes from './src/modules/profile/routes.js';
import leaderboardRoutes from './src/modules/leaderboard/routes.js';
import learnRoutes from './src/modules/learn/routes.js';
import gameProfileRoutes from './src/modules/gameprofile/routes.js';
import sessionRoutes from './src/modules/session/routes.js';
import shopRoutes from './src/modules/shop/routes.js';
import rewardsRoutes from './src/modules/rewards/routes.js';

// Session cleanup utility
import { cleanupExpiredSessions } from './src/modules/session/session.service.js';

// Initialize Express
const app = express();

// Database Connections
connectDB(); // MongoDB

// Connect Redis (optional - graceful fallback)
redisClient.connect()
    .then(() => console.log('✅ Redis Connected'))
    .catch((err) => console.warn('⚠️ Redis Connection Error (running without cache):', err.message));

// Middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests like Postman where origin is undefined
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('CORS not allowed'));
        }
    },
    credentials: true,
}));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/learn', learnRoutes);
app.use('/api/gameprofile', gameProfileRoutes);
app.use('/api/game-profile', gameProfileRoutes);   // alias so both paths work

// Session management routes
app.use('/api/session', sessionRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/rewards', rewardsRoutes);

// ─── Health checks ───────────────────────────────────────────
app.get('/', (_req, res) => {
    res.send('CrackCode Backend API is Running!');
});

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// ─── Global error handler ────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error('Global error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
});

// ─── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);

    // Clean up expired/inactive sessions every hour
    setInterval(async () => {
        try {
            const count = await cleanupExpiredSessions();
            if (count > 0) {
                console.log(`[CRON] Cleaned ${count} expired session(s)`);
            }
        } catch (err) {
            console.error('[CRON] Session cleanup error:', err.message);
        }
    }, 60 * 60 * 1000); // every hour
});

// ─── Graceful shutdown ───────────────────────────────────────
const shutdown = async (signal) => {
    console.log(`${signal} received. Closing connections...`);

    if (redisClient.isOpen) {
        await redisClient.quit();
        console.log('Redis disconnected');
    }

    process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));