import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // AUTH & PROFILE
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },

    // check acceptance of privacy policy
    acceptedTC: { type: Boolean, required: true, default: false },

    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },

    // VERIFICATION & PASSWORD RESET
    verifyotp: { type: String, default: "" },
    verifyotpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetotp: { type: String, default: "" },
    resetotpExpireAt: { type: Number, default: 0 },

    // GAME STATS
    username: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    level: {
      type: Number,
      default: 0, // 0=Beginner, calculated based on XP milestones
    },
    xp: { type: Number, default: 0 },
    totalXP: { type: Number, default: 0 }, // For leaderboard sorting
    currentStreak: {
      type: Number,
      default: 0, // Daily streak count from DailyBonus
    },
    tokens: { type: Number, default: 20 }, // New users get 20 free tokens
    rank: { type: String, default: "Rookie" },
    casesSolved: { type: Number, default: 0 }, // Track total cases solved for progress bar
    specialization: { type: String, default: "General" },

    lastActive: { type: Date, default: Date.now },

    // ACHIEVEMENTS
    achievements: [
      {
        achievement: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Achievement",
        },
        unlockedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
