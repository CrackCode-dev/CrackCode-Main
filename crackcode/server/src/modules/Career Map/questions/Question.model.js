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

// Dynamic model based on career path
export const getQuestionModel = (career) => {
  const collections = {
    "MLEngineer": "MLEngineerQ",
    "DataScientist": "DataScientistQ",
    "SoftwareEngineer": "SoftwareEngineerQ"
  };

  const collectionName = collections[career];
  
  if (!collectionName) {
    throw new Error(`Invalid career: ${career}. Valid options: MLEngineer, DataScientist, SoftwareEngineer`);
  }

  return mongoose.models[collectionName] || mongoose.model(collectionName, questionSchema, collectionName);
};

// Default export (MLEngineer for backward compatibility)
const Question = mongoose.models.MLEngineerQ || mongoose.model("MLEngineerQ", questionSchema, "MLEngineerQ");
export default Question;
