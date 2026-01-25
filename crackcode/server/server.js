const dotenv = require('dotenv');

// Load env variables
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const redisClient = require('./src/config/redis'); 
const leaderboardRoutes = require('./src/routes/leaderboardRoutes');

// Initialize Express
const app = express();

// Database Connections
connectDB(); // MongoDB

redisClient.connect()
    .then(() => console.log('✅ Redis Connected'))
    .catch((err) => console.error('❌ Redis Connection Error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leaderboard', leaderboardRoutes);

app.get('/', (req, res) => {
    res.send('CrackCode Backend API is Running!');
});

// Start Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});
