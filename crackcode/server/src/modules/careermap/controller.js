const CareerQuestion = require("./careermap/CareerQuestion.model");

// GET all questions (optional filter by category)
const getAllQuestions = async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await CareerQuestion.find(filter);
    res.status(200).json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single question by ID
const getQuestionById = async (req, res) => {
  try {
    const question = await CareerQuestion.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: "Question not found" });
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST create a new question
const createQuestion = async (req, res) => {
  try {
    const question = await CareerQuestion.create(req.body);
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT update a question
const updateQuestion = async (req, res) => {
  try {
    const question = await CareerQuestion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!question) return res.status(404).json({ success: false, message: "Question not found" });
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE a question
const deleteQuestion = async (req, res) => {
  try {
    const question = await CareerQuestion.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: "Question not found" });
    res.status(200).json({ success: true, message: "Question deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};