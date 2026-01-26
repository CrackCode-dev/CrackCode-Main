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
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    xp: { type: Number, default: 0 },
    totalXP: { type: Number, default: 0 }, // For leaderboard sorting
    tokens: { type: Number, default: 100 },
    rank: { type: String, default: "Rookie" },
    lastActive: { type: Date, default: Date.now },

    // ACCOUNT SETTINGS
    emailSettings: {
      notifications: { type: Boolean, default: true },
      securityAlerts: { type: Boolean, default: true },
    },

    // ACHIEVEMENTS
    achievements: [
      {
        achievement: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Achievement",
          required: true,
        },
        unlockedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
