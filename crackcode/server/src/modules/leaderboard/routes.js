// import express from "express";
// import { getGlobalLeaderboard, getMyRank, getPaginatedLeaderboard } from "./controller.js";
// import userAuth from "../auth/middleware.js";

// const router = express.Router();

// // Public routes
// router.get("/global", getGlobalLeaderboard);
// router.get("/paginated", getPaginatedLeaderboard);

// // Protected route
// router.get("/me", userAuth, getMyRank);

// export default router;


import express from "express";
import { getGlobalLeaderboard, getMyRank, getPaginatedLeaderboard } from "./controller.js";
import userAuth from "../auth/middleware.js";

const router = express.Router();

// Public routes
router.get("/global", getGlobalLeaderboard);
router.get("/paginated", getPaginatedLeaderboard);

// Protected route
router.get("/me", userAuth, getMyRank);

export default router;

