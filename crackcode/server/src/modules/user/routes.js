import express from "express";
import userAuth from "../auth/middleware.js";
import { getUserData, getProgressSummary, getUserActivity } from "./controller.js";

const router = express.Router();

router.get("/data", userAuth, getUserData);
router.get("/progress-summary", userAuth, getProgressSummary);
router.get("/activity", userAuth, getUserActivity);

export default router;
