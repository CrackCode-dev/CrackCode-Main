import { getQuestionsByDifficulty } from "./question.service.js";

export const getQuestions = async (req, res) => {

  try {

    const { difficulty } = req.query;

    const questions = await getQuestionsByDifficulty(difficulty);

    res.json({
      success: true,
      data: questions
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const submitAnswer = async (req, res) => {

  try {

    const { questionId, answer } = req.body;

    const question = await getQuestionById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const correct = checkAnswer(answer, question.correctAnswer);

    res.json({
      correct: correct
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};
