import mongoose from "mongoose";

const dailyBonusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    claimDate: {
      type: String, // "YYYY-MM-DD" — makes "already claimed today?" check trivial
      required: true,
    },

    xpAwarded: {
      type: Number,
      default: 10,
    },

    tokensAwarded: {
      type: Number,
      default: 5,
    },

    streakCount: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

// One claim per user per day
dailyBonusSchema.index({ userId: 1, claimDate: 1 }, { unique: true });

// TTL: auto-delete after 30 days (saves storage)
dailyBonusSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default mongoose.model("DailyBonus", dailyBonusSchema);