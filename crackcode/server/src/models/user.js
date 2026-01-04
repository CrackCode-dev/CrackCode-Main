import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // AUTH & PROFILE
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },

    // GAME STATS
    username: { type: String, required: true, unique: true },
    xp: { type: Number, default: 0 },
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
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
