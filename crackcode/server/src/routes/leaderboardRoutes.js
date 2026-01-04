import express from 'express';
import { getGlobalLeaderboard, getMyRank } from '../controllers/leaderboardController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

// Route to get the top 10 players for the podium and list
router.get('/global', getGlobalLeaderboard);

// Route to get the logged-in user's specific rank
router.get('/me', userAuth, getMyRank);

export default router; // <-- default export so server.js can import it
