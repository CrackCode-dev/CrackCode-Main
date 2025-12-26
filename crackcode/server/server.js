require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Connect to MongoDB (Source of Truth)
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5050 // 5 seconds timeout
})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 2. Connect to Redis (Real-time Leaderboard)
const redis = new Redis(process.env.REDIS_URL);
redis.on('error', (err) => {
    console.log("❌ Redis is not responding. Is the server running?");
});
redis.on('connect', () => console.log("✅ Redis Connected"));
redis.on('error', (err) => console.error("❌ Redis Error:", err));

app.get('/', (req, res) => res.send("CrackCode Backend API is Running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

