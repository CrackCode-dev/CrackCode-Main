// const dotenv = require('dotenv');

// // Load env variables
// dotenv.config();

// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./src/config/db');
// const redisClient = require('./src/config/redis'); 
// const leaderboardRoutes = require('./src/routes/leaderboardRoutes');

// // Initialize Express
// const app = express();

// // Database Connections
// connectDB(); // MongoDB

// redisClient.connect()
//     .then(() => console.log('✅ Redis Connected'))
//     .catch((err) => console.error('❌ Redis Connection Error:', err));

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/leaderboard', leaderboardRoutes);

// app.get('/', (req, res) => {
//     res.send('CrackCode Backend API is Running!');
// });

// // Start Server
// const PORT = process.env.PORT || 5050;
// app.listen(PORT, () => {
//     console.log(`🚀 Server started on http://localhost:${PORT}`);
// });


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
// import redisClient from './src/modules/leaderboard/redis.config.js';

// Import module routes
import authRoutes from './src/modules/auth/routes.js';
import userRoutes from './src/modules/user/routes.js';
import profileRoutes from './src/modules/profile/routes.js';
import leaderboardRoutes from './src/modules/leaderboard/routes.js';
import learnRoutes from './src/modules/learn/routes.js';

// Initialize Express
const app = express();

// Database Connections
connectDB(); // MongoDB

// Connect Redis (optional - graceful fallback)
// redisClient.connect()
//     .then(() => console.log('✅ Redis Connected'))
//     .catch((err) => console.warn('⚠️ Redis Connection Error (running without cache):', err.message));

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/learn', learnRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('CrackCode Backend API is Running!');
});

// Start Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});