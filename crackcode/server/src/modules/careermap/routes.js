const express = require("express");
const router = express.Router();
const {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("./controller");

// GET /api/career-questions          → get all (supports ?category=Software&difficulty=Easy)
// POST /api/career-questions         → create one
router.route("/").get(getAllQuestions).post(createQuestion);

// GET /api/career-questions/:id      → get one
// PUT /api/career-questions/:id      → update one
// DELETE /api/career-questions/:id   → delete one
router.route("/:id").get(getQuestionById).put(updateQuestion).delete(deleteQuestion);

module.exports = router;