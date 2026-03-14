import express from "express";
import userAuth from "../auth/middleware.js";
import { 
  getAllQuestions, 
  getQuestionById, 
  getQuestionByIdAndLanguage,
  getCollectionQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from "./question.controller.js";
import { getUserProgress, updateProgress, getRoadmap } from "./progress.controller.js";

const router = express.Router();

// Question routes
router.get("/questions", getAllQuestions);
router.get("/questions/by-collection", getCollectionQuestions);
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

export default router;
