import mongoose from "mongoose";
import User from "../auth/User.model.js";
import redisClient from "../leaderboard/redis.config.js"; // ← adjust path if needed

/**
 * Transaction Service (MongoDB + Redis Leaderboard Sync)
 * Handles atomic operations for XP, tokens, and shop purchases.
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

// ─── Audit logger ────────────────────────────────────────────
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


const syncLeaderboard = async (username, totalXP) => {
  try {
    if (redisClient.isOpen) {
      await redisClient.zAdd("global_leaderboard", {
        score: totalXP,
        value: username,
      });
    }
  } catch (err) {
    console.warn("⚠️ Redis leaderboard sync failed:", err.message);
    // Non-fatal — MongoDB remains the source of truth
  }
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

    // ✅ Sync updated XP to Redis leaderboard
    await syncLeaderboard(user.username, user.totalXP);

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

// ─────────────────────────────────────────────────────────────
// TOKEN AWARD
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// SPEND XP (for shop purchases)
// Supports both call styles
// ─────────────────────────────────────────────────────────────
export const spendXp = async (...args) => {
  let userId;
  let amount;
  let reason;
  let session;

  // Object style: spendXp({ userId, amount, reason, session })
  if (typeof args[0] === "object") {
    ({ userId, amount, reason, session } = args[0]);
  } else {
    // Positional style: spendXp(userId, amount)
    userId = args[0];
    amount = args[1];
  }

  if (!userId) throw new Error("User ID required");

  const _id =
    typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

  amount = Number(amount || 0);

  // Atomic deduction from XP
  const user = await User.findOneAndUpdate(
    { _id, xp: { $gte: amount } },
    {
      $inc: { xp: -amount },
      $set: { lastActive: new Date() },
    },
    { returnDocument: "after", session }
  );

  if (!user) {
    throw new Error("Not enough XP");
  }

  logTransaction(_id, "XP_SPEND", {
    amount,
    reason,
    remainingXP: user.xp,
  });

  return {
    success: true,
    remainingXP: user.xp,
  };
};

// ─────────────────────────────────────────────────────────────
// COMBINED REWARD
// ─────────────────────────────────────────────────────────────
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
    { returnDocument: "after" }
  );

  if (!user) throw new Error("User not found");

  const newRank = calculateRank(user.totalXP);

  if (user.rank !== newRank) {
    user.rank = newRank;
    await user.save();
  }

  // ✅ Sync updated XP to Redis leaderboard
  await syncLeaderboard(user.username, user.totalXP);

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

// ─────────────────────────────────────────────────────────────
// BALANCE SNAPSHOT
// ─────────────────────────────────────────────────────────────
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
  spendXp,
  awardRewards,
  getBalance,
  calculateRank,
};

