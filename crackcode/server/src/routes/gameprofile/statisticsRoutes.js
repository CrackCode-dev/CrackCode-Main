// Legacy route - statistics are now part of gameprofile module
// Use /api/gameprofile/statistics instead
import express from "express";
import userAuth from "../../middleware/auth/userAuth.js";
import { getUserStatistics } from "../../modules/gameprofile/statistics.controller.js";

const router = express.Router();
router.get("/user", userAuth, getUserStatistics);
export default router;
