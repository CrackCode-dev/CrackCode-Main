import express from "express";
import { getProgress, updateUserProgress, resetProgress } from "./progress.controller.js";

const router = express.Router();

// GET /api/progress
router.get("/", getProgress);

// POST /api/progress/update
router.post("/update", updateUserProgress);

// POST /api/progress/reset
router.post("/reset", resetProgress);

export default router;
