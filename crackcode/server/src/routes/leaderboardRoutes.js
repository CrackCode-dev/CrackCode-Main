const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

// Route to get the top 10 players for the podium and list
router.get('/global', leaderboardController.getGlobalLeaderboard);

// Route to get the logged-in user's specific rank
module.exports = router;