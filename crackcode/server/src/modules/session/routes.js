import express from "express";
import {
  refreshToken,
  logout,
  logoutAll,
  getSessions,
  revokeSession,
  getSessionState,
} from "./session.controller.js";
import { sessionAuth, rateLimiter } from "./session.middleware.js";

const router = express.Router();

// ── Public (no auth) ─────────────────────────────────────────
// Refresh uses the refresh-token cookie, not the access token
router.post(
  "/refresh",
  rateLimiter({ maxRequests: 10, windowMs: 60_000 }),
  refreshToken
);

// ── Protected (requires valid access token) ──────────────────
router.post("/logout", sessionAuth, logout);
router.post("/logout-all", sessionAuth, logoutAll);
router.get("/list", sessionAuth, getSessions);
router.delete("/revoke/:sessionId", sessionAuth, revokeSession);
router.get("/state", sessionAuth, getSessionState);

// Health check
router.get("/test", (_req, res) =>
  res.json({ success: true, message: "Session routes working" })
);

export default router;