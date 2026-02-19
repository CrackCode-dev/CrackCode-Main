import express from "express";
import { 
    getGlobalLeaderboard, 
    getMyRank, 
    getPaginatedLeaderboard 
} from "./controller.js";
import userAuth from "../auth/middleware.js";

const router = express.Router();

/**
 * @route   GET /api/leaderboard/global
 * @desc    Get top 10 players (Redis-first)
 * @access  Public
 */
router.get("/global", getGlobalLeaderboard);

/**
 * @route   GET /api/leaderboard/paginated
 * @desc    Get leaderboard with offset (View All feature)
 * @access  Public
 */
router.get("/paginated", getPaginatedLeaderboard);

/**
 * @route   GET /api/leaderboard/me
 * @desc    Get the rank and score of the logged-in user
 * @access  Private (Requires Auth Token)
 */
router.get("/me", userAuth, getMyRank);

export default router;
