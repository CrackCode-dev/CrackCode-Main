import express from "express";
import { getUserStatistics } from "../controllers/statisticsController.js";
import authMiddleware from "../middleware/userAuth.js"; // fixed path

const router = express.Router();

router.get("/user", authMiddleware, getUserStatistics);

export default router;
