import { 
  getQuestionsByDifficulty, 
  getQuestionById,
  getQuestionsByCategoryAndDifficulty
} from "./question.service.js";
import { updateProgress } from "../progress/progress.service.js";
//                           ☝️ "../" goes UP to "Career Map" folder
//                              then "/progress/" goes INTO progress folder

// Helper function to check answers
const checkAnswer = (userAnswer, correctAnswer, type) => {
  const normalizedUser = userAnswer.toLowerCase().trim();
  
  if (type === "fill_blank") {
    const validAnswers = correctAnswer.split(",").map(a => a.toLowerCase().trim());
    return validAnswers.includes(normalizedUser);
  }
  
  return normalizedUser === correctAnswer.toLowerCase().trim();
};

// Get questions
// GET /api/questions?difficulty=Easy
// GET /api/questions?difficulty=Easy&category=Machine Learning
export const getQuestions = async (req, res) => {
  try {
    const { difficulty, category } = req.query;

    if (!difficulty) {
      return res.status(400).json({
        success: false,
        message: "Difficulty is required (Easy, Medium, or Hard)"
      });
    }

    let questions;

    if (category) {
      questions = await getQuestionsByCategoryAndDifficulty(category, difficulty);
    } else {
      questions = await getQuestionsByDifficulty(difficulty);
    }

    res.json({
      success: true,
      count: questions.length,
      data: questions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Submit answer
// POST /api/questions/submit
// Body: { questionId, answer }
export const submitAnswer = async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    const userId = req.user?.id;

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

    const isCorrect = checkAnswer(answer, question.correctAnswer, question.type);

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

// Get single question
// GET /api/questions/:id
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
