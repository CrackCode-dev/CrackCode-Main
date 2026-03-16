import { 
  getQuestionsByDifficulty, 
  getQuestionById,
  getQuestionsByCategoryAndDifficulty,
  getAllQuestions
} from "./question.service.js";

// Valid career paths
const VALID_CAREERS = ["MLEngineer", "DataScientist", "SoftwareEngineer"];

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
// GET /api/questions?career=MLEngineer&difficulty=Easy
// GET /api/questions?career=DataScientist&difficulty=Medium&category=Data Science
export const getQuestions = async (req, res) => {
  try {
    const { career, difficulty, category } = req.query;

    // Validate career
    if (!career) {
      return res.status(400).json({
        success: false,
        message: "Career is required (MLEngineer, DataScientist, or SoftwareEngineer)"
      });
    }

    if (!VALID_CAREERS.includes(career)) {
      return res.status(400).json({
        success: false,
        message: `Invalid career. Valid options: ${VALID_CAREERS.join(", ")}`
      });
    }

    // Validate difficulty
    if (!difficulty) {
      return res.status(400).json({
        success: false,
        message: "Difficulty is required (Easy, Medium, or Hard)"
      });
    }

    let questions;

    if (category) {
      questions = await getQuestionsByCategoryAndDifficulty(career, category, difficulty);
    } else {
      questions = await getQuestionsByDifficulty(career, difficulty);
    }

    res.json({
      success: true,
      career,
      difficulty,
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
// Body: { career, questionId, answer }
export const submitAnswer = async (req, res) => {
  try {
    const { career, questionId, answer } = req.body;

    // Validate inputs
    if (!career || !questionId || !answer) {
      return res.status(400).json({
        success: false,
        message: "career, questionId, and answer are required"
      });
    }

    if (!VALID_CAREERS.includes(career)) {
      return res.status(400).json({
        success: false,
        message: `Invalid career. Valid options: ${VALID_CAREERS.join(", ")}`
      });
    }

    const question = await getQuestionById(career, questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    const isCorrect = checkAnswer(answer, question.correctAnswer, question.type);

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
// GET /api/questions/:id?career=MLEngineer
export const getQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { career } = req.query;

    if (!career) {
      return res.status(400).json({
        success: false,
        message: "Career is required"
      });
    }

    if (!VALID_CAREERS.includes(career)) {
      return res.status(400).json({
        success: false,
        message: `Invalid career. Valid options: ${VALID_CAREERS.join(", ")}`
      });
    }

    const question = await getQuestionById(career, id);

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

// Get available careers
// GET /api/questions/careers
export const getCareers = async (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: "MLEngineer",
        name: "ML Engineer",
        chapters: 4,
        totalQuestions: 60
      },
      {
        id: "DataScientist",
        name: "Data Scientist",
        chapters: 4,
        totalQuestions: 60
      },
      {
        id: "SoftwareEngineer",
        name: "Software Engineer",
        chapters: 4,
        totalQuestions: 60
      }
    ]
  });
};
