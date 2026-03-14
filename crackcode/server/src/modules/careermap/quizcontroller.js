// quiz.controller.js
// Handles fetching quiz questions from MongoDB
// Supports filtering by career, chapter, difficulty, and type

import { getQuizModel } from "./quiz.model.js";

// Maps career path names to their MongoDB collection names
const CAREER_COLLECTIONS = {
  "software-engineer": "SoftwareEngineerQ",
  "ml-engineer":       "MLEngineerQ",
  "data-scientist":    "DataScientistQ",
};

// Chapter → category mapping based on your quiz structure
const CHAPTER_CATEGORIES = {
  "software-engineer": {
    "oop":     ["General Programming", "Languages and Frameworks"],
    "dsa":     ["Data Structures", "Algorithms"],
    "webdev":  ["Web Development", "Security"],
    "devops":  ["System Design", "DevOps"],
  },
  "ml-engineer": {
    "ml-fundamentals": ["Machine Learning"],
    "deep-learning":   ["Deep Learning"],
    "mlops":           ["DevOps", "Version Control", "Data Engineering"],
    "ml-system":       ["Algorithms", "System Design"],
  },
  "data-scientist": {
    "data-science":    ["Data Science"],
    "ml-for-ds":       ["Machine Learning"],
    "database":        ["Database and SQL", "Database Systems", "Full-stack"],
    "data-engineering":["Data Engineering", "Distributed Systems", "Back-end", "Networking", "Low-level Systems"],
  },
};

// GET /api/quiz/careers
// Returns the list of available career paths
export async function getCareers(req, res) {
  try {
    const careers = Object.keys(CAREER_COLLECTIONS);
    res.status(200).json({ success: true, careers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/quiz/:career/chapters
// Returns the chapters available for a given career
export async function getChapters(req, res) {
  try {
    const { career } = req.params;

    const chapters = CHAPTER_CATEGORIES[career];
    if (!chapters) {
      return res.status(400).json({ success: false, message: "Invalid career path." });
    }

    res.status(200).json({ success: true, chapters: Object.keys(chapters) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/quiz/:career/questions
// Query params (all optional):
//   chapter    → filter by chapter (e.g. "oop", "dsa")
//   difficulty → Easy | Medium | Hard
//   type       → mcq | fill
//   limit      → number of questions (default: 10)
//
// If chapter is provided, fetches 5 Easy + 5 Medium + 5 Hard from that chapter's categories
// If no chapter, fetches random questions from the full collection
export async function getQuestions(req, res) {
  try {
    const { career } = req.params;
    const { chapter, difficulty, type, limit } = req.query;

    // Validate career
    const collectionName = CAREER_COLLECTIONS[career];
    if (!collectionName) {
      return res.status(400).json({
        success: false,
        message: `Invalid career. Valid options: ${Object.keys(CAREER_COLLECTIONS).join(", ")}`,
      });
    }

    const QuizModel = getQuizModel(collectionName);
    let questions = [];

    if (chapter) {
      // Validate chapter
      const categories = CHAPTER_CATEGORIES[career]?.[chapter];
      if (!categories) {
        return res.status(400).json({ success: false, message: "Invalid chapter for this career." });
      }

      // Fetch 5 questions per difficulty level from the chapter's categories (total 15)
      const difficulties = ["Easy", "Medium", "Hard"];

      for (const diff of difficulties) {
        const qs = await QuizModel.aggregate([
          { $match: { category: { $in: categories }, difficulty: diff } },
          { $sample: { size: 5 } },
        ]);
        questions.push(...qs);
      }

    } else {
      // Build a filter from query params
      const filter = {};
      if (difficulty) filter.difficulty = difficulty;
      if (type)       filter.type = type;

      const sampleSize = parseInt(limit) || 10;

      questions = await QuizModel.aggregate([
        { $match: filter },
        { $sample: { size: sampleSize } },
      ]);
    }

    if (!questions.length) {
      return res.status(404).json({ success: false, message: "No questions found." });
    }

    res.status(200).json({ success: true, total: questions.length, questions });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}