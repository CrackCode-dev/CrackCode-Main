
/**
 * Auth Middleware (Updated for Session Management)
 *
 * This is the SAME middleware used by all existing modules (profile, user,
 * gameprofile, leaderboard, learn). It now supports BOTH:
 *   - New session-based access tokens (with sessionId + tokenVersion)
 *   - Legacy JWT tokens ({ id: userId }) for backward compatibility
 *
 * Once you've fully migrated, you can remove the legacy fallback.
 */

import jwt from "jsonwebtoken";
import User from "./User.model.js";
import { validateSession } from "../session/session.service.js";

const userAuth = async (req, res, next) => {
  try {
    let token = null;

    // 1. Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. New accessToken cookie
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // 3. Legacy "token" cookie (old auth system)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

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

    // If the token is session-based, validate the session in MongoDB
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

    // Support both token payload shapes:
    //   New: { userId, sessionId, tokenVersion }
    //   Legacy: { id }
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
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      code: "AUTH_ERROR",
    });
  }
};

export default userAuth;