const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('./leaderboardController');

router.get('/', getLeaderboard);

module.exports = router;
