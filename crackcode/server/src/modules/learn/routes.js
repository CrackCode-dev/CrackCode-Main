import express from "express";
import userAuth from "../auth/middleware.js";
import { getAllQuestions, getQuestionById, createQuestion } from "./question.controller.js";
import { getUserProgress, updateProgress, getRoadmap } from "./progress.controller.js";

const router = express.Router();

// Question routes
router.get("/questions", getAllQuestions);
router.get("/questions/:id", getQuestionById);
router.post("/questions", userAuth, createQuestion); // TODO: add admin check

// Progress routes
router.get("/progress", userAuth, getUserProgress);
router.post("/progress", userAuth, updateProgress);

// Roadmap
router.get("/roadmap", userAuth, getRoadmap);

// Test route
router.get("/test", (_req, res) => res.send("learn routes working"));

export default router;
