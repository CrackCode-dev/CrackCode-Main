import Question from "./Question.model.js";
import { checkFillBlankAnswer } from "./answerChecker.js";

export const checkAnswer = async (req, res) => {

  const { questionId, answer } = req.body;

  const question = await Question.findById(questionId);

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  const isCorrect = checkFillBlankAnswer(answer, question.answers);

  res.json({
    correct: isCorrect
  });

};
