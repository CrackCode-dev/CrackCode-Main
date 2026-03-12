import Question from "./Question.model.js";

export const getQuestionsByDifficulty = async (difficulty) => {

  const questions = await Question.find({ difficulty });

  return questions;

};
