// Legacy route - achievements are now part of gameprofile module
// Use /api/gameprofile/achievements instead
import express from "express";
import userAuth from "../../middleware/auth/userAuth.js";
import { getUserAchievements, getAllAchievements } from "../../modules/gameprofile/achievement.controller.js";

const router = express.Router();
router.get("/", userAuth, getUserAchievements);
router.get("/all", getAllAchievements);
export default router;
