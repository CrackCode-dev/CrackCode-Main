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
      required: true,
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

// Connect to MLEngineerQ collection
const Question = mongoose.models.MLEngineerQ || mongoose.model("MLEngineerQ", questionSchema, "MLEngineerQ");

export default Question;
