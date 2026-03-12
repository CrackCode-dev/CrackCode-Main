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
