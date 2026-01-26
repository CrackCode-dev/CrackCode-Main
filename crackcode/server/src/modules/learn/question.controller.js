import Question from "./Question.model.js";

// Get all questions
export const getAllQuestions = async (req, res) => {
  try {
    const { difficulty, category } = req.query;
    const filter = {};

    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;

    const questions = await Question.find(filter);
    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a single question by ID
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    return res.status(200).json(question);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create a new question (admin only)
export const createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    return res.status(201).json(question);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
