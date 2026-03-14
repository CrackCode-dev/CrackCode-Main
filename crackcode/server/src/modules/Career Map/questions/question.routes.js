import express from "express";
import { getQuestions, getQuestion, submitAnswer } from "./question.controller.js";

const router = express.Router();

// GET /api/questions?difficulty=Easy
router.get("/", getQuestions);

// GET /api/questions/:id
router.get("/:id", getQuestion);

// POST /api/questions/submit
router.post("/submit", submitAnswer);

export default router;
