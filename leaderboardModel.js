const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  username: String,
  xp: Number,
  level: Number,
  avatar: String,
  tokens: Number
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
