import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Profile fields
    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    // Account Settings
    emailSettings: {
      notifications: {
        type: Boolean,
        default: true,
      },
      securityAlerts: {
        type: Boolean,
        default: true,
      },
    },

    // 🏆 Achievements
    achievements: [
      {
        achievement: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Achievement",
          required: true,
        },
        unlockedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
