import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
    },

    type: {
      type: String,
      enum: ["mcq", "fill_blank"],
      default: "mcq",
    },

    correctAnswer: {
      type: String,
      required: true,
    },

    options: [String],

    wrongAnswers: [String],
  },
  { timestamps: true }
);

// ✅ FIX
const Question =
  mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;
