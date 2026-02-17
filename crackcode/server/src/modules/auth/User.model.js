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
    // GAME STATS
    username: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    xp: { type: Number, default: 0 },
    totalXP: { type: Number, default: 0 },
    tokens: { type: Number, default: 100 },
    rank: { type: String, default: "Rookie" },

    // ⭐ ADD THESE FOR LEADERBOARD
    casesSolved: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
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
