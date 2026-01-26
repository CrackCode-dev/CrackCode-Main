import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [String],
    starterCode: {
      type: String,
      default: "",
    },
    testCases: [
      {
        input: String,
        expectedOutput: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
