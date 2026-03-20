import express from "express";
import userAuth from "../auth/middleware.js";
import { getUserData, getProgressSummary, getUserActivity, getUserProgressRaw } from "./controller.js";

const router = express.Router();

router.get("/data", userAuth, getUserData);
router.get("/progress-summary", userAuth, getProgressSummary);
router.get("/activity", userAuth, getUserActivity);
router.get("/progress-raw", userAuth, getUserProgressRaw);

export default router;
