import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    category: {
      type: String,
      enum: ["Data Structures", "Algorithms", "Web Development"],
      required: true,
    },
    isSolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Case = mongoose.model("Case", caseSchema);

export default Case; 
