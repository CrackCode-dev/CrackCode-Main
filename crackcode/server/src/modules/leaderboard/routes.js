import express from "express";
import { getGlobalLeaderboard, getMyRank } from "./controller.js";
import userAuth from "../auth/middleware.js";

const router = express.Router();

router.get("/global", getGlobalLeaderboard);
router.get("/me", userAuth, getMyRank);

export default router;
