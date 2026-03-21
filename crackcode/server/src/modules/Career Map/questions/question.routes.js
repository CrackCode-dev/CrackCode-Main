import express from "express";
import userAuth from "../../auth/middleware.js";
import { getQuestions, getQuestion, submitAnswer, getCareers , getQuestionCount} from "./question.controller.js";

const router = express.Router();

// GET /api/questions/careers - Get all available career paths
router.get("/careers", getCareers);

// GET /api/questions/count?career=MLEngineer&categories=Arrays,Strings - Get total question count for specific career and categories
router.get("/count", getQuestionCount);

// GET /api/questions?career=MLEngineer&difficulty=Easy
router.get("/", getQuestions);

// GET /api/questions/:id?career=MLEngineer
router.get("/:id", getQuestion);

// POST /api/questions/submit (requires authentication)
router.post("/submit", userAuth, submitAnswer);

export default router;
