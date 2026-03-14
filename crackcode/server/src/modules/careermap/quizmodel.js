// quiz.model.js
// One shared schema used across all career collections
// Collections: SoftwareEngineerQ, MLEngineerQ, DataScientistQ

import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    wrongAnswers: {
      type: [String],
      default: [],
    },
    options: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      enum: ["mcq", "fill"],
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
  },
  { timestamps: true }
);

// Dynamically binds this schema to any collection name
// Avoids OverwriteModelError if model is already registered
export function getQuizModel(collectionName) {
  if (mongoose.modelNames().includes(collectionName)) {
    return mongoose.model(collectionName);
  }
  return mongoose.model(collectionName, quizSchema, collectionName);
}