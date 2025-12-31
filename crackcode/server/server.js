const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const redisClient = require('./src/config/redis'); 
const leaderboardRoutes = require('./src/routes/leaderboardRoutes');

// 1. Load Environment Variables
dotenv.config();

// 2. Initialize Express
const app = express();

// 3. Database Connections
connectDB(); // MongoDB

// Redis Connection (v4+ syntax)
redisClient.connect()
    .then(() => console.log('✅ Redis Connected'))
    .catch((err) => console.error('❌ Redis Connection Error:', err));

// 4. Middleware
app.use(cors()); // Crucial for Frontend-Backend communication
app.use(express.json()); // Allows parsing of JSON data in requests

// 5. Routes
// All leaderboard requests will start with /api/leaderboard
app.use('/api/leaderboard', leaderboardRoutes);

// Base route for testing if the server is alive
app.get('/', (req, res) => {
    res.send('CrackCode Backend API is Running!');
});

// 6. Start the Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});
