// Re-export routes from modular structure
export { default as authRoutes } from "./auth/routes.js";
export { default as userRoutes } from "./user/routes.js";
export { default as profileRoutes } from "./profile/routes.js";
export { default as leaderboardRoutes } from "./leaderboard/routes.js";
export { default as gameprofileRoutes } from "./gameprofile/routes.js";
export { default as learnRoutes } from "./learn/routes.js";

// Re-export models
export { default as User } from "./auth/User.model.js";
export { default as Achievement } from "./gameprofile/Achievement.model.js";
export { default as Case } from "./gameprofile/Case.model.js";
export { default as Question } from "./learn/Question.model.js";
export { default as Submission } from "./learn/Submission.model.js";
export { default as UserProgress } from "./learn/UserProgress.model.js";

// Re-export middleware
export { default as userAuth } from "./auth/middleware.js";

// Re-export config
export { default as redisClient } from "./leaderboard/redis.config.js";
