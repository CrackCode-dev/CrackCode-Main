// quiz.routes.js
// All routes are protected by JWT middleware

import express from "express";
import { getCareers, getChapters, getQuestions } from "./quiz.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js"; // adjust path if needed

const router = express.Router();

// GET /api/quiz/careers
// Returns all available career paths
router.get("/careers", verifyToken, getCareers);

// GET /api/quiz/:career/chapters
// Returns chapters for a specific career
router.get("/:career/chapters", verifyToken, getChapters);

// GET /api/quiz/:career/questions
// Returns random questions — filter with ?chapter=oop&difficulty=Easy&type=mcq&limit=10
router.get("/:career/questions", verifyToken, getQuestions);

export default router;