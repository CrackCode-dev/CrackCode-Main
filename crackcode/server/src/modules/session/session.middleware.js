import jwt from "jsonwebtoken";
import User from "../auth/User.model.js";
import { validateSession } from "./session.service.js";

// ─── Helpers ─────────────────────────────────────────────────

/**
 * Extract bearer / cookie token from the request.
 * Priority: Authorization header > accessToken cookie > legacy "token" cookie
 */
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  if (req.cookies?.accessToken) return req.cookies.accessToken;
  if (req.cookies?.token) return req.cookies.token; // legacy support
  return null;
};

// ─── sessionAuth ─────────────────────────────────────────────
/**
 * Primary authentication middleware for ALL protected routes.
 *
 * 1. Extracts JWT from header or cookie
 * 2. Verifies JWT signature + expiry
 * 3. If token contains sessionId → validate session in MongoDB
 * 4. Fetches user from DB
 * 5. Attaches req.user, req.userId, req.sessionId
 */
const sessionAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login.",
        code: "NO_TOKEN",
      });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please refresh.",
          code: "TOKEN_EXPIRED",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
        code: "INVALID_TOKEN",
      });
    }

    // Session-based validation (new tokens have sessionId + tokenVersion)
    if (decoded.sessionId && decoded.tokenVersion !== undefined) {
      const validation = await validateSession(
        decoded.sessionId,
        decoded.tokenVersion
      );

      if (!validation.valid) {
        return res.status(401).json({
          success: false,
          message: validation.reason || "Session invalid",
          code: "SESSION_INVALID",
        });
      }
      req.sessionId = decoded.sessionId;
    }

    // Support both token formats: { userId } (new) and { id } (legacy)
    const userId = decoded.userId || decoded.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    console.error("Session auth error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      code: "AUTH_ERROR",
    });
  }
};

// ─── optionalAuth ────────────────────────────────────────────
/**
 * Continues even if the user is NOT authenticated.
 * Useful for public pages that show extra info when logged in.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;
    const user = await User.findById(userId).select("-password");

    if (user) {
      req.user = user;
      req.userId = user._id;
      req.sessionId = decoded.sessionId;
    }
  } catch {
    // Silently continue unauthenticated
  }
  next();
};

// ─── rateLimiter ─────────────────────────────────────────────
/**
 * Simple in-memory sliding-window rate limiter.
 * Replace with Redis-backed limiter when you scale beyond one server.
 */
const rateLimitStore = new Map();

// Garbage-collect stale entries every 5 min
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.windowStart > 120_000) rateLimitStore.delete(key);
  }
}, 5 * 60 * 1000).unref(); // .unref() so this timer doesn't keep the process alive

const rateLimiter = (options = {}) => {
  const { windowMs = 60_000, maxRequests = 100 } = options;

  return (req, res, next) => {
    const key = req.userId?.toString() || req.ip || "unknown";
    const now = Date.now();

    let record = rateLimitStore.get(key);

    if (!record || now - record.windowStart > windowMs) {
      record = { count: 1, windowStart: now };
      rateLimitStore.set(key, record);
    } else {
      record.count += 1;
    }

    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please slow down.",
        code: "RATE_LIMITED",
        retryAfter: Math.ceil(
          (record.windowStart + windowMs - now) / 1000
        ),
      });
    }

    res.setHeader("X-RateLimit-Limit", maxRequests);
    res.setHeader(
      "X-RateLimit-Remaining",
      Math.max(0, maxRequests - record.count)
    );

    next();
  };
};

export { sessionAuth, optionalAuth, rateLimiter };
export default sessionAuth;