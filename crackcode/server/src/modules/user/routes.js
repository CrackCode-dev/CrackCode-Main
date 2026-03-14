import express from "express";
import userAuth from "../auth/middleware.js";
import { getUserData, getProgressSummary } from "./controller.js";

const router = express.Router();

router.get("/data", userAuth, getUserData);
router.get("/progress-summary", userAuth, getProgressSummary);

export default router;
