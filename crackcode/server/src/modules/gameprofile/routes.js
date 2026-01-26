import express from "express";
import userAuth from "../../middleware/auth/userAuth.js";
import { getUserAchievements, getAllAchievements } from "./achievement.controller.js";
import { getUserStatistics } from "./statistics.controller.js";

const router = express.Router();

// Achievement routes
router.get("/achievements", userAuth, getUserAchievements);
router.get("/achievements/all", getAllAchievements);

// Statistics routes
router.get("/statistics", userAuth, getUserStatistics);

// Test route
router.get("/test", (_req, res) => res.send("gameprofile routes working"));

export default router;
