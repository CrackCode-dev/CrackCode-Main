import crypto from "crypto";
import jwt from "jsonwebtoken";
import Session from "./Session.model.js";

// ─── Configuration ───────────────────────────────────────────
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
const SESSION_EXPIRY_DAYS = 7;
const MAX_SESSIONS_PER_USER = 5;

// ─── Helpers ─────────────────────────────────────────────────

/**
 * Parse device info from the incoming request
 */
const parseDeviceInfo = (req) => {
  const userAgent = req.headers?.["user-agent"] || "";
  const ip =
    req.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.ip ||
    req.connection?.remoteAddress ||
    "unknown";

  let deviceType = "unknown";
  let browser = "unknown";
  let os = "unknown";

  if (/mobile/i.test(userAgent)) deviceType = "mobile";
  else if (/tablet|ipad/i.test(userAgent)) deviceType = "tablet";
  else if (/windows|mac|linux/i.test(userAgent)) deviceType = "desktop";

  if (/edg/i.test(userAgent)) browser = "Edge";
  else if (/chrome/i.test(userAgent)) browser = "Chrome";
  else if (/firefox/i.test(userAgent)) browser = "Firefox";
  else if (/safari/i.test(userAgent)) browser = "Safari";

  if (/windows/i.test(userAgent)) os = "Windows";
  else if (/mac/i.test(userAgent)) os = "macOS";
  else if (/android/i.test(userAgent)) os = "Android";
  else if (/iphone|ipad|ios/i.test(userAgent)) os = "iOS";
  else if (/linux/i.test(userAgent)) os = "Linux";

  return { userAgent: userAgent.substring(0, 500), ip, deviceType, browser, os };
};

const generateSessionId = () => crypto.randomBytes(32).toString("hex");

const generateAccessToken = (userId, sessionId, tokenVersion) =>
  jwt.sign(
    { userId: userId.toString(), sessionId, tokenVersion, type: "access" },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

const generateRefreshToken = (userId, sessionId, tokenVersion) =>
  jwt.sign(
    { userId: userId.toString(), sessionId, tokenVersion, type: "refresh" },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

// ─── Public API ──────────────────────────────────────────────

/**
 * Create a new session for a user (called from login/register)
 * @param {string|ObjectId} userId
 * @param {Request} req - Express request (for device info)
 * @returns {{ accessToken, refreshToken, sessionId, expiresAt }}
 */
export const createSession = async (userId, req) => {
  const deviceInfo = parseDeviceInfo(req);
  const sessionId = generateSessionId();
  const tokenVersion = 1;

  // Enforce max-sessions: evict the oldest if at the limit
  const activeSessions = await Session.countDocuments({
    userId,
    isActive: true,
  });

  if (activeSessions >= MAX_SESSIONS_PER_USER) {
    const oldest = await Session.findOne({ userId, isActive: true }).sort({
      lastActivity: 1,
    });
    if (oldest) {
      oldest.isActive = false;
      await oldest.save();
    }
  }

  // Generate token pair
  const accessToken = generateAccessToken(userId, sessionId, tokenVersion);
  const refreshToken = generateRefreshToken(userId, sessionId, tokenVersion);

  // Persist session
  const session = await Session.create({
    userId,
    sessionId,
    refreshToken,
    deviceInfo,
    tokenVersion,
    expiresAt: new Date(
      Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    ),
  });

  return {
    accessToken,
    refreshToken,
    sessionId,
    expiresAt: session.expiresAt,
  };
};

/**
 * Validate an active session (called from middleware on every request)
 * Returns { valid, reason?, userId? }
 */
export const validateSession = async (sessionId, tokenVersion) => {
  const session = await Session.findOne({ sessionId, isActive: true });

  if (!session) return { valid: false, reason: "Session not found or revoked" };
  if (session.tokenVersion !== tokenVersion)
    return { valid: false, reason: "Token version mismatch" };
  if (session.expiresAt < new Date())
    return { valid: false, reason: "Session expired" };

  // Fire-and-forget: update lastActivity for session list display
  Session.updateOne({ _id: session._id }, { lastActivity: new Date() }).catch(
    () => {}
  );

  return { valid: true, userId: session.userId.toString() };
};

/**
 * Refresh access token using a valid refresh token
 * Implements token rotation + reuse detection
 */
export const refreshAccessToken = async (token) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    if (decoded.type !== "refresh") {
      return { success: false, message: "Invalid token type" };
    }

    const session = await Session.findOne({
      sessionId: decoded.sessionId,
      isActive: true,
    });

    if (!session) {
      return { success: false, message: "Session not found or revoked" };
    }

    // ── Token-reuse detection ──────────────────────────────
    // If the presented tokenVersion is behind the stored one,
    // someone is replaying an old refresh token → nuke everything.
    if (session.tokenVersion !== decoded.tokenVersion) {
      await invalidateAllUserSessions(session.userId);
      return {
        success: false,
        message: "Token reuse detected. All sessions invalidated for safety.",
      };
    }

    // ── Rotate tokens ──────────────────────────────────────
    session.tokenVersion += 1;
    session.lastActivity = new Date();

    const newAccessToken = generateAccessToken(
      session.userId,
      session.sessionId,
      session.tokenVersion
    );
    const newRefreshToken = generateRefreshToken(
      session.userId,
      session.sessionId,
      session.tokenVersion
    );

    session.refreshToken = newRefreshToken;
    await session.save();

    return {
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (err) {
    return { success: false, message: "Invalid or expired refresh token" };
  }
};

/**
 * Invalidate a single session (logout from one device)
 */
export const invalidateSession = async (sessionId) => {
  const session = await Session.findOneAndUpdate(
    { sessionId },
    { isActive: false },
    { new: true }
  );
  return !!session;
};

/**
 * Invalidate ALL sessions for a user (security panic button)
 */
export const invalidateAllUserSessions = async (userId) => {
  const result = await Session.updateMany(
    { userId, isActive: true },
    { isActive: false }
  );
  return result.modifiedCount;
};

/**
 * List active sessions for a user (for "manage devices" UI)
 */
export const getUserSessions = async (userId) => {
  return Session.find(
    { userId, isActive: true },
    { refreshToken: 0 } // never expose refresh tokens
  ).sort({ lastActivity: -1 });
};

/**
 * Periodic cleanup (run via cron or at startup)
 * The TTL index handles expired sessions automatically, but this
 * also sweeps inactive sessions that are > 24 h old.
 */
export const cleanupExpiredSessions = async () => {
  const result = await Session.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      {
        isActive: false,
        updatedAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    ],
  });
  return result.deletedCount;
};

// Default export for convenience (controller imports)
export default {
  createSession,
  validateSession,
  refreshAccessToken,
  invalidateSession,
  invalidateAllUserSessions,
  getUserSessions,
  cleanupExpiredSessions,
};