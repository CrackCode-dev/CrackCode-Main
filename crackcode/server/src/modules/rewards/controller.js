import DailyBonus from "./DailyBonus.model.js";
import {
  awardXP,
  awardTokens,
  awardRewards,
  getBalance,
} from "../session/transaction.service.js";

// ─── Helper: today as "YYYY-MM-DD" ──────────────────────────
const todayString = () => new Date().toISOString().slice(0, 10);

// ─── Helper: yesterday as "YYYY-MM-DD" ──────────────────────
const yesterdayString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

// ============================================================
// POST /api/rewards/award-xp
// Body: { amount: Number, source?: String }
// ============================================================
export const awardXPHandler = async (req, res) => {
  try {
    const { amount, source } = req.body;

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "amount must be a positive number" });
    }

    const result = await awardXP(req.userId, amount, source || "manual");

    return res.json({
      success: true,
      message: `Awarded ${amount} XP`,
      state: result,
    });
  } catch (error) {
    console.error("Award XP error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// POST /api/rewards/award-tokens
// Body: { amount: Number, source?: String }
// ============================================================
export const awardTokensHandler = async (req, res) => {
  try {
    const { amount, source } = req.body;

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "amount must be a positive number" });
    }

    const result = await awardTokens(req.userId, amount, source || "manual");

    return res.json({
      success: true,
      message: `Awarded ${amount} tokens`,
      state: result,
    });
  } catch (error) {
    console.error("Award tokens error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// POST /api/rewards/complete-challenge
// Body: { challengeId: String, xp?: Number, tokens?: Number }
//
// This is the endpoint the code editor / quiz system calls
// after a user successfully passes all tests.
// ============================================================
export const completeChallengeHandler = async (req, res) => {
  try {
    const { challengeId, xp = 50, tokens = 10 } = req.body;

    if (!challengeId) {
      return res
        .status(400)
        .json({ success: false, message: "challengeId is required" });
    }

    const result = await awardRewards(
      req.userId,
      xp,
      tokens,
      `challenge:${challengeId}`
    );

    return res.json({
      success: true,
      message: `Challenge complete! +${xp} XP, +${tokens} tokens`,
      state: result,
    });
  } catch (error) {
    console.error("Complete challenge error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// POST /api/rewards/daily-bonus
// No body needed — claims based on server date + userId.
// ============================================================
export const claimDailyBonus = async (req, res) => {
  try {
    const userId = req.userId;
    const today = todayString();

    // Check if already claimed today
    const existing = await DailyBonus.findOne({ userId, claimDate: today });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Daily bonus already claimed today",
        nextClaimAt: `${today}T24:00:00.000Z`,
      });
    }

    // Determine streak
    const yesterday = yesterdayString();
    const yesterdayClaim = await DailyBonus.findOne({
      userId,
      claimDate: yesterday,
    });
    const streakCount = yesterdayClaim ? yesterdayClaim.streakCount + 1 : 1;

    // Streak multiplier: every 5 consecutive days → double reward
    const multiplier = streakCount % 5 === 0 ? 2 : 1;
    const xpReward = 10 * multiplier;
    const tokenReward = 5 * multiplier;

    // Award rewards atomically
    const result = await awardRewards(userId, xpReward, tokenReward, "daily_bonus");

    // Record the claim
    await DailyBonus.create({
      userId,
      claimDate: today,
      xpAwarded: xpReward,
      tokensAwarded: tokenReward,
      streakCount,
    });

    return res.json({
      success: true,
      message: `Daily bonus claimed! +${xpReward} XP, +${tokenReward} tokens`,
      xp: xpReward,
      tokens: tokenReward,
      streakCount,
      multiplier,
      state: result,
    });
  } catch (error) {
    // Handle duplicate key (race condition: double click)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Daily bonus already claimed today",
      });
    }
    console.error("Daily bonus error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
// ============================================================
// GET /api/rewards/balance
// Returns current XP, tokens, rank.
// ============================================================
export const getBalanceHandler = async (req, res) => {
  try {
    const balance = await getBalance(req.userId);
    return res.json({ success: true, state: balance });
  } catch (error) {
    console.error("Get balance error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};