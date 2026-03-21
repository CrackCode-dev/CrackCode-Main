import express from "express";
import { getMyBadgeProgress, getBadgeStats, checkAllBadges } from "./badge.controller.js";
import userAuth from "../auth/middleware.js";

const router = express.Router();

/*
route  = GET /api/badges/my-progress
 desc  =  Get user's badge progress
access =  Private (Requires Auth)
 */
router.get("/my-progress", userAuth, getMyBadgeProgress);

/*
route  = GET /api/badges/stats
 desc  =  Get user's badge statistics
access = Private (Requires Auth)
 */
router.get("/stats", userAuth, getBadgeStats);

/*
route  = POST /api/badges/check-all
desc   = Manually check and unlock all eligible badges
access = Private (Requires Auth)
 */
router.post("/check-all", userAuth, checkAllBadges);

export default router;
