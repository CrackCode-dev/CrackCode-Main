const mongoose = require("mongoose");

const CareerQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: [(val) => val.length >= 2, "At least 2 options required"],
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Software", "DataScience", "DevOps"],
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    explanation: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerQuestion", CareerQuestionSchema);