import express from "express";
import userAuth from "../auth/middleware.js";
import { 
  getAllQuestions, 
  getQuestionById, 
  getQuestionByIdAndLanguage,
  getCollectionQuestions,
  getDailyChallenge,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from "./question.controller.js";
import { getUserProgress, updateProgress, getRoadmap } from "./progress.controller.js";
import { getChallengesCollection, getWeeklyChallenge } from "./question.controller.js";

const router = express.Router();

// Question routes
router.get("/questions", getAllQuestions);
router.get("/questions/by-collection", getCollectionQuestions);
router.get("/daily-challenge", getDailyChallenge);
router.get("/questions/:id", getQuestionById);
router.get("/questions/:id/:language", getQuestionByIdAndLanguage);
router.post("/questions", userAuth, createQuestion);
router.put("/questions/:id", userAuth, updateQuestion);
router.delete("/questions/:id", userAuth, deleteQuestion);

// Progress routes
router.get("/progress", userAuth, getUserProgress);
router.post("/progress", userAuth, updateProgress);

// Roadmap
router.get("/roadmap", userAuth, getRoadmap);

// Test route
router.get("/test", (_req, res) => res.send("learn routes working"));
// Fetch challenge collection (e.g., challengePythonQ)
router.get("/challenges", getChallengesCollection);
router.get("/weeklychallenge", getWeeklyChallenge);

export default router;
