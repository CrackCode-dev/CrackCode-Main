import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
    },
    attempts: {
      type: Number,
      default: 0,
    },
    completedAt: Date,
  },
  { timestamps: true }
);

// Compound index for unique user-question pair
userProgressSchema.index({ userId: 1, questionId: 1 }, { unique: true });

export default mongoose.model("UserProgress", userProgressSchema);
