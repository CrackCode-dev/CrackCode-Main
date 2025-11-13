const express = require('express');
const mongoose = require('mongoose');
const leaderboardRoutes = require('./leaderboardRoutes');

const app = express();
app.use(express.json());
app.use('/api/leaderboard', leaderboardRoutes);
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/SDGP')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

app.listen(5000, () => console.log('🚀 Server running on port 5000'));



