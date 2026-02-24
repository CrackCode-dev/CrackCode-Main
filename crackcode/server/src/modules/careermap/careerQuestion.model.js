import mongoose from "mongoose";

const careerQuestionSchema = new mongoose.Schema(
  {
    careerPath: {
      type: String,
      required: true, // "software", "datascience", "devops"
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      required: true,
    },

    correctAnswer: {
      type: Number, // index of correct option (0–3)
      required: true,
    },

    explanation: {
      type: String, // optional (nice for advanced level)
    },
  },
  { timestamps: true }
);

export default mongoose.model("CareerQuestion", careerQuestionSchema);