import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
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
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "javascript",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "wrong_answer", "error"],
      default: "pending",
    },
    executionTime: Number,
    memoryUsed: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);
