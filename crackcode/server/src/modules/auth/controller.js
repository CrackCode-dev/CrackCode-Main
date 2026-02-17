import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./User.model.js";
import transporter from "./nodemailer.config.js";
import { createSession } from "../session/session.service.js";
import {
  setSessionCookies,
  clearSessionCookies,
} from "../session/session.controller.js";
import Session from "../session/Session.model.js";
import mongoose from "mongoose";

// ─── Legacy cookie (kept for backward-compat during migration) ──
const legacyCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // only send cookie if our site is running in browser
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ─── Username builder ────────────────────────────────────────
const buildUniqueUsername = async (rawUsername, fallbackName) => {
  const base =
    (rawUsername || fallbackName || "user")
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 18) || "user";

  let candidate = base;
  let suffix = 1;

  while (await User.exists({ username: candidate })) {
    suffix += 1;
    candidate = `${base}${suffix}`.slice(0, 22);
  }

  return candidate;
};


// REGISTER
// ============================================================
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }

    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const normalizedUsername = await buildUniqueUsername(
      username,
      name || email
    );
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      username: normalizedUsername,
      password: hashedPassword,
    });

    // ── Create session (replaces plain JWT) ──────────────────
    const sessionData = await createSession(user._id, req);
    setSessionCookies(res, sessionData.accessToken, sessionData.refreshToken);

    // Also set legacy cookie so old client code still works during migration
    const legacyToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", legacyToken, legacyCookieOptions);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      sessionId: sessionData.sessionId,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};


// LOGIN
// ============================================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    // ── Create session ──────────────────────────────────────
    const sessionData = await createSession(user._id, req);
    setSessionCookies(res, sessionData.accessToken, sessionData.refreshToken);

    // Legacy cookie
    const legacyToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", legacyToken, legacyCookieOptions);

    return res.json({
      success: true,
      message: "Login successful",
      sessionId: sessionData.sessionId,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

// LOGOUT - handles both sessionId and userId
// ============================================================
export const logout = async (req, res) => {
  try {
    // Try to delete session from database
    let sessionDeleted = false;
    
    // Method 1: Try using sessionId if it's a valid ObjectId
    if (req.sessionId && mongoose.Types.ObjectId.isValid(req.sessionId)) {
      const result = await Session.findByIdAndDelete(req.sessionId);
      if (result) {
        sessionDeleted = true;
        console.log(`✅ Session deleted: ${req.sessionId}`);
      }
    }
    
    // Method 2: If sessionId didn't work, try finding by userId
    if (!sessionDeleted && req.userId) {
      // Delete the most recent session for this user
      const result = await Session.findOneAndDelete({ 
        userId: req.userId 
      });
      if (result) {
        sessionDeleted = true;
        console.log(`✅ Session deleted for user: ${req.userId}`);
      }
    }
    
    // Always clear cookies, regardless of session deletion
    clearSessionCookies(res);
    
    return res.json({ 
      success: true, 
      message: "Logged out successfully",
      sessionDeleted 
    });
  } catch (error) {
    console.error("Logout error:", error);
    // Still clear cookies even if there's an error
    clearSessionCookies(res);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};


// LOGOUT ALL DEVICES 
// ============================================================
export const logoutAllDevices = async (req, res) => {
  try {
    const userId = req.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Delete all sessions for this user from the database
    const result = await Session.deleteMany({ userId });

    // Clear cookies for the current device
    clearSessionCookies(res);

    return res.json({
      success: true,
      message: `Logged out from all devices. ${result.deletedCount} session(s) terminated.`,
      sessionsTerminated: result.deletedCount,
    });
  } catch (error) {
    console.error("Logout all devices error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout from all devices",
      error: error.message,
    });
  }
};


// Email verification and Check OTP and reset password 
// ============================================================

export const sendVerifyOtp = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyotp = otp;
    user.verifyotpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
    });

    return res.json({ success: true, message: "Verification OTP sent on email" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ success: false, message: "Missing OTP" });
    }

    const user = await User.findOne({ verifyotp: otp });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (user.verifyotpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    user.isAccountVerified = true;
    user.verifyotp = "";
    user.verifyotpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user
        ? {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            username: req.user.username,
            isAccountVerified: req.user.isAccountVerified,
          }
        : null,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetotp = otp;
    user.resetotpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It will expire in 15 minutes.`,
    });

    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!user.resetotp || user.resetotp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetotpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetotp = "";
    user.resetotpExpireAt = 0;
    await user.save();

    return res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};