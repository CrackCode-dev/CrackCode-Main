import mongoose from "mongoose";
import User from "../auth/User.model.js";

/**
 * Transaction Service (MongoDB Only)
 * Handles atomic operations for XP, tokens, and shop purchases.
 * Uses MongoDB's atomic operators + transactions to prevent race conditions.
 */

// ─── Rank calculation ────────────────────────────────────────
const RANK_THRESHOLDS = [
  { min: 10000, rank: "Legend" },
  { min: 5000, rank: "Master" },
  { min: 2500, rank: "Expert" },
  { min: 1000, rank: "Advanced" },
  { min: 500, rank: "Intermediate" },
  { min: 100, rank: "Beginner" },
];

export const calculateRank = (totalXP) => {
  for (const t of RANK_THRESHOLDS) {
    if (totalXP >= t.min) return t.rank;
  }
  return "Rookie";
};

// ─── Audit logger (swap for a DB collection in production) ──
const logTransaction = (userId, type, data) => {
  console.log(
    "[TRANSACTION]",
    JSON.stringify({
      timestamp: new Date().toISOString(),
      userId: userId.toString(),
      type,
      ...data,
    })
  );
};

// ─── Public API ──────────────────────────────────────────────

/**
 * Award XP to a user (with automatic rank recalculation).
 * Uses a MongoDB transaction for safety.
 */
export const awardXP = async (userId, amount, source = "unknown") => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user = await User.findById(userId).session(session);
    if (!user) throw new Error("User not found");

    user.xp += amount;
    user.totalXP += amount;
    user.lastActive = new Date();
    user.rank = calculateRank(user.totalXP);

    await user.save({ session });
    await session.commitTransaction();

    logTransaction(userId, "XP_AWARD", {
      amount,
      source,
      newTotal: user.totalXP,
      newRank: user.rank,
    });

    return {
      success: true,
      xp: user.xp,
      totalXP: user.totalXP,
      rank: user.rank,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Award tokens to a user.
 */
export const awardTokens = async (userId, amount, source = "unknown") => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user = await User.findById(userId).session(session);
    if (!user) throw new Error("User not found");

    user.tokens += amount;
    user.lastActive = new Date();

    await user.save({ session });
    await session.commitTransaction();

    logTransaction(userId, "TOKEN_AWARD", {
      amount,
      source,
      newBalance: user.tokens,
    });

    return { success: true, tokens: user.tokens };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Spend tokens (for shop purchases).
 * Uses findOneAndUpdate for an atomic check-and-deduct in a single query.
 */
export const spendTokens = async (userId, amount, itemId, itemName) => {
  const result = await User.findOneAndUpdate(
    {
      _id: userId,
      tokens: { $gte: amount }, // only deduct if the balance is sufficient
    },
    {
      $inc: { tokens: -amount },
      $set: { lastActive: new Date() },
    },
    { new: true }
  );

  if (!result) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    throw new Error(
      `Insufficient tokens. Need ${amount}, have ${user.tokens}`
    );
  }

  logTransaction(userId, "TOKEN_SPEND", {
    amount,
    itemId,
    itemName,
    newBalance: result.tokens,
  });

  return {
    success: true,
    tokens: result.tokens,
    purchasedItem: { itemId, itemName },
  };
};

/**
 * Combined reward (XP + Tokens) — typically called on challenge completion.
 * Uses atomic $inc for performance (single DB round-trip).
 */
export const awardRewards = async (
  userId,
  xp,
  tokens,
  source = "challenge"
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $inc: { xp, totalXP: xp, tokens },
      $set: { lastActive: new Date() },
    },
    { new: true }
  );

  if (!user) throw new Error("User not found");

  // Recalc rank
  const newRank = calculateRank(user.totalXP);
  if (user.rank !== newRank) {
    user.rank = newRank;
    await user.save();
  }

  logTransaction(userId, "REWARD_COMBINED", {
    xp,
    tokens,
    source,
    newXP: user.totalXP,
    newTokens: user.tokens,
    newRank: user.rank,
  });

  return {
    success: true,
    xp: user.xp,
    totalXP: user.totalXP,
    tokens: user.tokens,
    rank: user.rank,
  };
};

/**
 * Get a user's current balance snapshot.
 */
export const getBalance = async (userId) => {
  const user = await User.findById(userId).select(
    "xp totalXP tokens rank"
  );
  if (!user) throw new Error("User not found");

  return {
    xp: user.xp,
    totalXP: user.totalXP,
    tokens: user.tokens,
    rank: user.rank,
  };
};

export default {
  awardXP,
  awardTokens,
  spendTokens,
  awardRewards,
  getBalance,
  calculateRank,
};