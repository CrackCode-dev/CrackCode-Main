import express from "express";
import { sessionAuth } from "../session/session.middleware.js";
import { getUserData, getProgressSummary, getUserActivity, getUserProgressRaw, deleteAccount } from "./controller.js";

const router = express.Router();

router.get("/data", sessionAuth, getUserData);
router.get("/progress-summary", sessionAuth, getProgressSummary);
router.get("/activity", sessionAuth, getUserActivity);
router.get("/progress-raw", sessionAuth, getUserProgressRaw);
router.post("/delete-account", sessionAuth, deleteAccount);

export default router;
