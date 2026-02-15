import express from "express";
import userAuth from "../auth/middleware.js";
import {
  awardXPHandler,
  awardTokensHandler,
  completeChallengeHandler,
  claimDailyBonus,
  getBalanceHandler,
} from "./controller.js";

const router = express.Router();

// All rewards routes require authentication
router.post("/award-xp", userAuth, awardXPHandler);
router.post("/award-tokens", userAuth, awardTokensHandler);
router.post("/complete-challenge", userAuth, completeChallengeHandler);
router.post("/daily-bonus", userAuth, claimDailyBonus);
router.get("/balance", userAuth, getBalanceHandler);

// Health check
router.get("/test", (_req, res) =>
  res.json({ success: true, message: "Rewards routes working" })
);

export default router;