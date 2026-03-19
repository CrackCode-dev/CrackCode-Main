import crypto from "crypto";
import jwt from "jsonwebtoken";
import Session from "./Session.model.js";
import {
  cacheSession,
  addUserSession,
  getCachedSession,
  deleteCachedSession,
  removeUserSession,
  deleteAllUserSessionCache,
  checkRedisHealth,
} from "./redis.session.js";
import logger from "../../utils/logger.js";

//  Configuration 
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
const SESSION_EXPIRY_DAYS = 7;
const MAX_SESSIONS_PER_USER = 5;

//  Helpers 

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

//  Public API 

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

  
  // Cache the session in Redis. MongoDB remains source of truth.
    // Cache the session in Redis. MongoDB remains the source of truth.
    // We store a very small payload in Redis (userId, tokenVersion, isActive)
    // because the middleware only needs those fields to validate requests.
    try {
      const ttlSeconds = Math.max(
        0,
        Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000)
      );

      // Cache payload: only store what middleware needs for fast validation
      const payload = {
        userId: session.userId.toString(),
        tokenVersion: session.tokenVersion,
        isActive: true,
      };

      // Write through cache. If Redis fails, the app falls back to MongoDB.
      // We log the result so beginners can see whether cache writes succeeded.
      try {
        const cacheResult = await cacheSession(sessionId, payload, ttlSeconds);
        logger.info(`[Session] cacheSession for ${sessionId} returned: ${cacheResult}`);
      } catch (e) {
        logger.warn('[Session] Redis cache failed:', e?.message || e);
      }

      // Add sessionId to the user's session set for quick "logout all"
      try {
        const addUserResult = await addUserSession(session.userId.toString(), sessionId, ttlSeconds);
        logger.info(`[Session] addUserSession for user ${session.userId.toString()} returned: ${addUserResult}`);
      } catch (e) {
        logger.warn('[Session] Redis user_sessions failed:', e?.message || e);
      }
    } catch (cacheErr) {
      // Never fail the login flow because of cache problems
      logger.warn('[Session] Redis caching failed, continuing with MongoDB:', cacheErr?.message || cacheErr);
    }

  return {
    accessToken,
    refreshToken,
    sessionId,
    expiresAt: session.expiresAt,
  };
};

/*
  Validate an active session (called from middleware on every request)
  Returns { valid, reason?, userId? }
 */
export const validateSession = async (sessionId, tokenVersion) => {
  // First, try Redis cache for a fast-path validation.
  try {
    const cached = await getCachedSession(sessionId);
    if (cached) {
      // Redis hit: ensure session looks active and tokenVersion matches.
      if (!cached.isActive) {
        return { valid: false, reason: "Session not found or revoked" };
      }
      if (cached.tokenVersion !== tokenVersion) {
        // Token version mismatch - clear stale cache entry
        await deleteCachedSession(sessionId).catch(() => {});
        await removeUserSession(cached.userId, sessionId).catch(() => {});
        return { valid: false, reason: "Token version mismatch" };
      }

      // Fast success return. Update lastActivity in MongoDB (fire-and-forget)
      // Also refresh Redis cache to keep lastActivity in sync
      Session.updateOne({ sessionId }, { lastActivity: new Date() })
        .then(() => {
          // Repopulate Redis cache with updated lastActivity
          const ttlSeconds = Math.max(0, Math.floor((new Date().getTime() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000 - Date.now()) / 1000));
          const payload = {
            userId: cached.userId,
            tokenVersion: cached.tokenVersion,
            isActive: true,
          };
          return cacheSession(sessionId, payload, ttlSeconds).catch(() => {});
        })
        .catch(() => {});

      return { valid: true, userId: String(cached.userId) };
    }
  } catch (redisErr) {
    // If Redis fails for any reason, log and continue to MongoDB fallback.
    logger.warn('[Session] Redis validation failed, falling back to MongoDB:', redisErr?.message || redisErr);
  }

  // Redis miss or error → fallback to MongoDB (source of truth)
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

  // Populate Redis cache for future fast-paths (best-effort)
  try {
    const ttlSeconds = Math.max(
      0,
      Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000)
    );

    const payload = {
      userId: session.userId.toString(),
      tokenVersion: session.tokenVersion,
      isActive: true,
    };

    // cacheSession and addUserSession are best-effort; failures shouldn't block validation
    await cacheSession(sessionId, payload, ttlSeconds).catch((e) => {
          logger.warn('[Session] Redis repopulation warning:', e?.message || e);
    });
    await addUserSession(session.userId.toString(), sessionId, ttlSeconds).catch((e) => {
          logger.warn('[Session] Redis repopulation (user_sessions) warning:', e?.message || e);
    });
  } catch (cacheErr) {
    logger.warn('[Session] Redis repopulation failed after MongoDB lookup:', cacheErr?.message || cacheErr);
  }

  return { valid: true, userId: session.userId.toString() };
};

/*
  Refresh access token using a valid refresh token
 Implements token rotation + reuse detection
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

    //  Token-reuse detection 
    // If the presented tokenVersion is behind the stored one,
    // someone is replaying an old refresh token remove everything.
    if (session.tokenVersion !== decoded.tokenVersion) {
      await invalidateAllUserSessions(session.userId);
      return {
        success: false,
        message: "Token reuse detected. All sessions invalidated for safety.",
      };
    }

    //  Rotate tokens atomically ──────────────────────────────────────
    // Use MongoDB atomic operators to prevent race condition where
    // multiple simultaneous refresh requests could get same tokenVersion
    const updatedSession = await Session.findByIdAndUpdate(
      session._id,
      {
        $inc: { tokenVersion: 1 },
        lastActivity: new Date(),
      },
      { returnDocument: "after" } // Return the updated document (mongoose v7)
    );

    if (!updatedSession || updatedSession.tokenVersion === undefined) {
      return { success: false, message: "Failed to rotate tokens" };
    }

    // Use the atomically-updated tokenVersion for new tokens
    const newTokenVersion = updatedSession.tokenVersion;

    const newAccessToken = generateAccessToken(
      updatedSession.userId,
      updatedSession.sessionId,
      newTokenVersion
    );
    const newRefreshToken = generateRefreshToken(
      updatedSession.userId,
      updatedSession.sessionId,
      newTokenVersion
    );

    // Update refresh token and save
    updatedSession.refreshToken = newRefreshToken;
    await updatedSession.save();

    // Update Redis cache so tokenVersion is in sync
    try {
      const ttlSeconds = Math.max(
        0,
        Math.floor((new Date(updatedSession.expiresAt).getTime() - Date.now()) / 1000)
      );

      const payload = {
        userId: updatedSession.userId.toString(),
        tokenVersion: newTokenVersion,
        isActive: true,
      };

      await cacheSession(updatedSession.sessionId, payload, ttlSeconds).catch((e) => {
        logger.warn('[Session] Redis refresh cache warning:', e?.message || e);
      });

      await addUserSession(updatedSession.userId.toString(), updatedSession.sessionId, ttlSeconds).catch((e) => {
        logger.warn('[Session] Redis refresh user_sessions warning:', e?.message || e);
      });
    } catch (redisErr) {
      logger.warn('[Session] Redis refresh update failed:', redisErr?.message || redisErr);
    }

    return {
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (err) {
    return { success: false, message: "Invalid or expired refresh token" };
  }
};

/*
 Invalidate a single session (logout from one device)
 */
export const invalidateSession = async (sessionId) => {
  // Find and mark inactive in MongoDB (source of truth)
  const session = await Session.findOneAndUpdate(
    { sessionId },
    { isActive: false },
    { returnDocument: "after" }
  );

  if (!session) return false;

  // Best effort: remove from Redis cache and user's session set.
  try {
    await deleteCachedSession(sessionId).catch(() => {});
    await removeUserSession(session.userId.toString(), sessionId).catch(() => {});
  } catch (err) {
    // swallow errors — MongoDB is authoritative
    logger.warn('[Session] Redis invalidate warning:', err?.message || err);
  }

  return true;
};

/* Invalidate ALL sessions for a user (security panic button)
 */
export const invalidateAllUserSessions = async (userId) => {
  //  mark all sessions inactive in MongoDB
  const result = await Session.updateMany(
    { userId, isActive: true },
    { isActive: false }
  );

  // Best effort: clear Redis cache for this user's sessions to keep caches consistent.
  try {
    // Our helper deletes session keys and the user_sessions set atomically (pipeline)
    const userIdStr = userId?.toString ? userId.toString() : String(userId);
    await deleteAllUserSessionCache(userIdStr).catch(() => {});
  } catch (err) {
    logger.warn('[Session] Redis invalidateAll warning:', err?.message || err);
  }

  return result.modifiedCount;
};

/*
 List active sessions for a user (for "manage devices" UI)
 */
export const getUserSessions = async (userId) => {
  return Session.find(
    { userId, isActive: true },
    { refreshToken: 0 } // never expose refresh tokens
  ).sort({ lastActivity: -1 });
};

/*
  Periodic cleanup 
  The TTL index handles expired sessions automatically, but this
  also sweeps inactive sessions that are > 24 h old.
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

/*
 Initialize session module and check Redis health on startup
 Returns { success: boolean, redisConnected: boolean, message: string }
 */
export const initializeSessionModule = async () => {
  try {
    const redisHealth = await checkRedisHealth();
    const status = {
      success: true,
      redisConnected: redisHealth.connected,
      message: `Session module initialized. ${redisHealth.message}`,
    };
    
    if (!redisHealth.connected) {
      logger.warn('[Session] ⚠️  Redis unavailable — will use MongoDB fallback for caching');
    } else {
      logger.info('[Session] ✅ Redis connected for session caching');
    }
    
    return status;
  } catch (err) {
    return {
      success: false,
      redisConnected: false,
      message: `Session initialization failed: ${err?.message || err}`,
    };
  }
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
  initializeSessionModule,
};