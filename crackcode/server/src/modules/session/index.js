// ─── Session Module Exports ──────────────────────────────────
// Import from this file instead of reaching into individual files.

export { default as Session } from "./Session.model.js";
export { default as sessionRoutes } from "./routes.js";
export {
  sessionAuth,
  optionalAuth,
  rateLimiter,
} from "./session.middleware.js";
export { default as sessionAuth_default } from "./session.middleware.js";
export {
  createSession,
  validateSession,
  refreshAccessToken,
  invalidateSession,
  invalidateAllUserSessions,
  getUserSessions,
  cleanupExpiredSessions,
} from "./session.service.js";
export {
  awardXP,
  awardTokens,
  spendTokens,
  awardRewards,
  getBalance,
  calculateRank,
} from "./transaction.service.js";
export {
  setSessionCookies,
  clearSessionCookies,
  accessCookieOptions,
  refreshCookieOptions,
} from "./session.controller.js";