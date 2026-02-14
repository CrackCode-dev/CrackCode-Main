// ─── Route Exports ───────────────────────────────────────────
export { default as authRoutes } from "./auth/routes.js";
export { default as userRoutes } from "./user/routes.js";
export { default as profileRoutes } from "./profile/routes.js";
export { default as leaderboardRoutes } from "./leaderboard/routes.js";
export { default as learnRoutes } from "./learn/routes.js";
export { default as gameProfileRoutes } from "./gameprofile/routes.js";
export { default as sessionRoutes } from "./session/routes.js";       // NEW
export { default as rewardsRoutes } from "./rewards/routes.js";       // NEW
export { default as shopRoutes } from "./shop/routes.js";             // NEW

// ─── Model Exports ───────────────────────────────────────────
export { default as User } from "./auth/User.model.js";
export { default as Session } from "./session/Session.model.js";      // NEW
export { default as DailyBonus } from "./rewards/DailyBonus.model.js"; // NEW
export { default as ShopItem } from "./shop/ShopItem.model.js";       // NEW
export { default as Purchase } from "./shop/Purchase.model.js";       // NEW
export { default as Question } from "./learn/Question.model.js";
export { default as Submission } from "./learn/Submission.model.js";
export { default as UserProgress } from "./learn/UserProgress.model.js";

// ─── Middleware Exports ──────────────────────────────────────
export { default as userAuth } from "./auth/middleware.js";
export { sessionAuth, optionalAuth, rateLimiter } from "./session/session.middleware.js";

// ─── Config Exports ──────────────────────────────────────────
export { default as redisClient } from "./leaderboard/redis.config.js";