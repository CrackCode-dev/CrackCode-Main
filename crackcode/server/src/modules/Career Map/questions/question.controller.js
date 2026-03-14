import { getQuestionsByDifficulty, getQuestionById } from "./question.service.js";
import { updateProgress } from "../progress/progress.service.js";

// Helper function to check fill blank answers
const checkFillBlankAnswer = (userAnswer, correctAnswers) => {
  const normalizedUserAnswer = userAnswer.toLowerCase().trim();
  return correctAnswers.some(ans => ans.toLowerCase().trim() === normalizedUserAnswer);
};

// Get questions by difficulty
export const getQuestions = async (req, res) => {
  try {
    const { difficulty } = req.query;

    if (!difficulty) {
      return res.status(400).json({
        success: false,
        message: "Difficulty is required (Easy, Medium, or Hard)"
      });
    }

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

// Submit answer and update progress
export const submitAnswer = async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    const userId = req.user?.id; // Get user ID if authenticated

    if (!questionId || !answer) {
      return res.status(400).json({
        success: false,
        message: "questionId and answer are required"
      });
    }

    const question = await getQuestionById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    let isCorrect = false;

    // Check answer based on question type
    if (question.type === "fill_blank") {
      const validAnswers = question.correctAnswer.split(",").map(a => a.trim());
      isCorrect = checkFillBlankAnswer(answer, validAnswers);
    } else {
      // For MCQ
      isCorrect = answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
    }

    // Update user progress if authenticated
    if (userId) {
      await updateProgress(userId, question.difficulty, isCorrect);
    }

    res.json({
      success: true,
      correct: isCorrect,
      correctAnswer: isCorrect ? null : question.correctAnswer
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single question by ID
export const getQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await getQuestionById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    res.json({
      success: true,
      data: question
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
