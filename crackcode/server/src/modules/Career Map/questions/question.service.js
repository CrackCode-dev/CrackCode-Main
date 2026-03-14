import Question from "./Question.model.js";

// Get questions by difficulty
export const getQuestionsByDifficulty = async (difficulty) => {
  const questions = await Question.find({ difficulty });
  return questions;
};

// Get single question by ID
export const getQuestionById = async (questionId) => {
  const question = await Question.findById(questionId);
  return question;
};

// Get questions by category
export const getQuestionsByCategory = async (category) => {
  const questions = await Question.find({ category });
  return questions;
};

// Get questions by category and difficulty
export const getQuestionsByCategoryAndDifficulty = async (category, difficulty) => {
  const questions = await Question.find({ category, difficulty });
  return questions;
};
