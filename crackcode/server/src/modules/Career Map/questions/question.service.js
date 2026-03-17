import { getQuestionModel } from "./Question.model.js";

// Get questions by career and difficulty
export const getQuestionsByDifficulty = async (career, difficulty) => {
  const Question = getQuestionModel(career);
  const questions = await Question.find({ difficulty });
  return questions;
};

// Get single question by ID
export const getQuestionById = async (career, questionId) => {
  const Question = getQuestionModel(career);
  const question = await Question.findById(questionId);
  return question;
};

// Get questions by category
export const getQuestionsByCategory = async (career, category) => {
  const Question = getQuestionModel(career);
  const questions = await Question.find({ category });
  return questions;
};

// Get questions by category and difficulty
export const getQuestionsByCategoryAndDifficulty = async (career, category, difficulty) => {
  const Question = getQuestionModel(career);
  const questions = await Question.find({ category, difficulty });
  return questions;
};

// Get all questions for a career
export const getAllQuestions = async (career) => {
  const Question = getQuestionModel(career);
  const questions = await Question.find();
  return questions;
};
