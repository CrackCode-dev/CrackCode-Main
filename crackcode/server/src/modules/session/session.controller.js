import sessionService from "./session.service.js";
import { getBalance } from "./transaction.service.js";

// ─── Cookie config ───────────────────────────────────────────
const isProduction = () => process.env.NODE_ENV === "production";

export const accessCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? "strict" : "lax",
  maxAge: 15 * 60 * 1000, // 15 minutes
});

export const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/api/session/refresh", // only sent to the refresh endpoint
});

// ─── Helper: set both cookies on the response ────────────────
export const setSessionCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, accessCookieOptions());
  res.cookie("refreshToken", refreshToken, refreshCookieOptions());
};

// ─── Helper: clear all auth cookies ──────────────────────────
export const clearSessionCookies = (res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken", { path: "/api/session/refresh" });
  res.clearCookie("token"); // legacy
};

// ─────────────────────────────────────────────────────────────
//There is NO "createSession" endpoint here.
// Sessions are created INSIDE the auth controller (login/register).
// ─────────────────────────────────────────────────────────────

/**
 * POST /api/session/refresh
 * No auth required — uses the refresh-token cookie.
 */
export const refreshToken = async (req, res) => {
  try {
    const token =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
        code: "NO_REFRESH_TOKEN",
      });
    }

    const result = await sessionService.refreshAccessToken(token);

    if (!result.success) {
      clearSessionCookies(res);
      return res.status(401).json({
        success: false,
        message: result.message,
        code: "REFRESH_FAILED",
      });
    }

    // Set rotated tokens
    setSessionCookies(res, result.accessToken, result.refreshToken);

    return res.json({ success: true, message: "Token refreshed" });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to refresh token",
    });
  }
};

/**
 * POST /api/session/logout
 * Invalidates the current session.
 */
export const logout = async (req, res) => {
  try {
    if (req.sessionId) {
      await sessionService.invalidateSession(req.sessionId);
    }

    clearSessionCookies(res);

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

/**
 * POST /api/session/logout-all
 * Invalidates ALL sessions for the current user (all devices).
 */
export const logoutAll = async (req, res) => {
  try {
    const count = await sessionService.invalidateAllUserSessions(req.userId);

    clearSessionCookies(res);

    return res.json({
      success: true,
      message: `Logged out from ${count} session(s)`,
    });
  } catch (error) {
    console.error("Logout all error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout from all devices",
    });
  }
};

/**
 * GET /api/session/list
 * Returns all active sessions for the current user with "isCurrent" flag.
 */
export const getSessions = async (req, res) => {
  try {
    const sessions = await sessionService.getUserSessions(req.userId);

    const mapped = sessions.map((s) => ({
      id: s.sessionId,
      deviceInfo: s.deviceInfo,
      lastActivity: s.lastActivity,
      createdAt: s.createdAt,
      isCurrent: s.sessionId === req.sessionId,
    }));

    return res.json({ success: true, sessions: mapped });
  } catch (error) {
    console.error("Get sessions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get sessions",
    });
  }
};

/**
 * DELETE /api/session/revoke/:sessionId
 * Revoke a specific session (cannot revoke your own — use logout).
 */
export const revokeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (sessionId === req.sessionId) {
      return res.status(400).json({
        success: false,
        message: "Cannot revoke current session. Use logout instead.",
      });
    }

    // Make sure the target session belongs to this user
    const sessions = await sessionService.getUserSessions(req.userId);
    const target = sessions.find((s) => s.sessionId === sessionId);

    if (!target) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    await sessionService.invalidateSession(sessionId);

    return res.json({ success: true, message: "Session revoked" });
  } catch (error) {
    console.error("Revoke session error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to revoke session",
    });
  }
};

/**
 * GET /api/session/state
 * Returns the authenticated user's current balance (XP, tokens, rank).
 * This is the endpoint the React SessionContext calls on mount.
 */
export const getSessionState = async (req, res) => {
  try {
    const balance = await getBalance(req.userId);

    return res.json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        isAccountVerified: req.user.isAccountVerified,
      },
      state: balance,
    });
  } catch (error) {
    console.error("Get session state error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get session state",
    });
  }
};