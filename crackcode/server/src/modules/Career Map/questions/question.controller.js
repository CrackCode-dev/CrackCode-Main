import { 
  getQuestionsByDifficulty, 
  getQuestionById,
  getQuestionsByCategoryAndDifficulty,
  getAllQuestions,
  countQuestionsByCategories
} from "./question.service.js";
import User from "../../auth/User.model.js";
import { checkAndUnlockMultipleBadges } from "../../badges/badge.service.js";
import UserProgress from "../../learn/UserProgress.model.js";

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
    const userId = req.userId;
    const { career, questionId, answer } = req.body;

    // Require authentication
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

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

    // If answer is correct, update progress and check for badge unlocks
    if (isCorrect) {
      try {
        // Check if already completed to avoid duplicate rewards
        const existingProgress = await UserProgress.findOne({ userId, questionId });
        const isFirstCompletion = !existingProgress || existingProgress.status !== 'completed';

        // Update progress
        await UserProgress.findOneAndUpdate(
          { userId, questionId },
          {
            status: "completed",
            completedAt: new Date(),
            $inc: { attempts: 1 },
          },
          { upsert: true, new: true }
        );

        // On first correct answer, increment casesSolved and check badges
        if (isFirstCompletion) {
          const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
              $inc: { casesSolved: 1 }
            },
            { returnDocument: "after" }
          );

          // Check and unlock relevant badges based on new casesSolved count
          const badgesToCheck = ['beginner', 'cases_5', 'cases_10', 'cases_25'];
          const newlyUnlocked = await checkAndUnlockMultipleBadges(userId, badgesToCheck);
          
          if (newlyUnlocked.length > 0) {
            console.log(`✅ New badges unlocked for user ${userId}: ${newlyUnlocked.join(', ')}`);
          }

          return res.json({
            success: true,
            correct: true,
            correctAnswer: null,
            newCasesSolved: updatedUser?.casesSolved ?? 0,
            badgesUnlocked: newlyUnlocked
          });
        }
      } catch (err) {
        console.error(`❌ Failed to process correct answer for user ${userId}:`, err.message);
        // Still return success for the question, but without badge unlock info
      }
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

// GET /api/questions/count?career=SoftwareEngineer&categories=Algorithms,Data Structures
export const getQuestionCount = async (req, res) => {
  try {
    const { career, categories } = req.query;

    if (!career || !categories) {
      return res.status(400).json({ success: false, message: "career and categories are required" });
    }
    if (!VALID_CAREERS.includes(career)) {
      return res.status(400).json({ success: false, message: `Invalid career` });
    }

    const categoryList = categories.split(",").map(c => c.trim());
    const count = await countQuestionsByCategories(career, categoryList);

    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
