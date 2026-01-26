// Auth Middleware - JWT verification and user protection

import jwt from "jsonwebtoken";
import User from "./User.model.js";

// Middleware to protect routes
// Supports both Bearer token (Authorization header) and httpOnly cookie (token)
const userAuth = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Fallback to cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login.",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // Set both req.user and req.userId for backward compatibility
    req.user = user;
    req.userId = user._id;

    // Proceed to next middleware/route
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ success: false, message: "Token is invalid or expired" });
  }
};

export default userAuth;
