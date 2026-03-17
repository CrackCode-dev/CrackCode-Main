import express from "express";
import { getProgress, getAllProgress, updateUserProgress, resetProgress } from "./progress.controller.js";

const router = express.Router();

// GET /api/progress?career=MLEngineer - Get progress for specific career
router.get("/", getProgress);

// GET /api/progress/all - Get all progress for user
router.get("/all", getAllProgress);

// POST /api/progress/update - Update progress
router.post("/update", updateUserProgress);

// POST /api/progress/reset - Reset progress
router.post("/reset", resetProgress);

export default router;
