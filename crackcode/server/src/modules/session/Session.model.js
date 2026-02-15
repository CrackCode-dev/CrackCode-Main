import mongoose from "mongoose";

/**
 * Session Document Schema for MongoDB
 * Stores user session data with token management
 */
const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    refreshToken: {
      type: String,
      required: true,
    },

    tokenVersion: {
      type: Number,
      default: 1,
    },

    deviceInfo: {
      userAgent: String,
      ip: String,
      deviceType: {
        type: String,
        enum: ["mobile", "tablet", "desktop", "unknown"],
      },
      browser: String,
      os: String,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    lastActivity: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// TTL Index: MongoDB auto-deletes documents once expiresAt is reached
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for common query: "get active sessions for a user"
sessionSchema.index({ userId: 1, isActive: 1 });

export default mongoose.model("Session", sessionSchema);