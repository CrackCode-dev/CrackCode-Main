import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./User.model.js";
import PendingRegistration from "./PendingRegistration.model.js";
import { sendTransactionalEmail } from "../notifications/brevo.client.js";
import { 
  createSession,
  invalidateSession,
  invalidateAllUserSessions
} from "../session/session.service.js";
import {
  setSessionCookies,
  clearSessionCookies,
} from "../session/session.controller.js";
import Session from "../session/Session.model.js";
import { checkAndUnlockBadge } from "../badges/badge.service.js";

// Legacy cookie (kept for backward-compat during migration) 
const legacyCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // only send cookie if our site is running in browser
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

//  Username builder 
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

export const register = async (req, res) =>{
  try {
    // extract entered details from fields 
    const { name, email, password, confirmPassword, acceptedTC} = req.body;

    if(!name || !email || !password){
      return res.status(400).json({
        success:false,
        message: "Missing essentail details."
      });
    }

    if (confirmPassword && password !== confirmPassword){
      return res.status(400).json({
        success: false,
        message: "Passwords do not match."
      });
    }

    // Accept various truthy representations from clients (boolean, "true", "1", 1)
    const acceptedTCBool =
      acceptedTC === true ||
      acceptedTC === "true" ||
      acceptedTC === "1" ||
      acceptedTC === 1;

    if (acceptedTC !== undefined && !acceptedTCBool) {
      return res.status(400).json({
        success: false,
        message: "You must accept the Terms and Conditions to register.",
      });
    }

    // Ensure email not already used by a real user
    const existingUser = await User.findOne({ email });
    if(existingUser){
      return res.status(400).json({
        success: false,
        message: "User already exists with this email."
      });
    }
    // If a pending registration exists for this email, remove it (we'll recreate)
    await PendingRegistration.deleteMany({ email });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create pending registration and send OTP (account will be created after verification)
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpiry = new Date();
    otpExpiry.setHours(otpExpiry.getHours() + 24);
    const pending = new PendingRegistration({
      name,
      email,
      password: hashedPassword,
      acceptedTC,
      otp,
      otpExpireAt: otpExpiry,
    });
    await pending.save();

    // Send OTP email via Brevo API only. Fail fast if API key not configured.
    try {
      const apiKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY || process.env.SIB_API_KEY;
      if (!apiKey) {
        // In non-production, log OTP to help local testing. In production, return error.
        if (process.env.NODE_ENV !== "production") {
          console.log(`DEV OTP for ${email}: ${otp} (tempId=${pending._id})`);
        } else {
          console.error("BREVO_API_KEY missing - cannot send verification email");
          return res.status(500).json({ success: false, message: "Email provider not configured (BREVO_API_KEY missing)" });
        }
      } else {
        const html = `<p>Your OTP is <strong>${otp}</strong>. Verify your account using this OTP.</p>`;
        await sendTransactionalEmail({ to: email, subject: "Account Verification OTP", html, senderEmail: process.env.SENDER_EMAIL });
      }
    } catch (mailErr) {
      console.error("⚠️ Failed to send verification email:", mailErr?.message || mailErr);
      if (process.env.NODE_ENV !== "production") {
        console.log(`DEV OTP for ${email}: ${otp} (tempId=${pending._id})`);
      } else {
        return res.status(500).json({ success: false, message: "Failed to send verification email" });
      }
    }

    return res.status(200).json({
      success: true,
      message: "OTP generated. Complete verification to create your account.",
      tempId: pending._id,
    });

  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error. Please try again." 
    });
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

    //  Check if account is verified 
    if (!user.isAccountVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Please verify your email first. Signing up pending verification." });
    }

    //  Check account status (prevents suspended/banned users) 
    if (user.accountStatus !== "active") {
      return res
        .status(403)
        .json({ success: false, message: "Your account is not active. Contact support." });
    }

    //  Create session 
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
      accessToken: sessionData.accessToken,
      refreshToken: sessionData.refreshToken,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        isAccountVerified: user.isAccountVerified,
        accountStatus: user.accountStatus,
        lastActive: user.lastActive,
        level: user.level,
        rank: user.rank,
        xp: user.xp,
        avatar: user.avatar,
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
    // Invalidate session (cleanup both MongoDB and Redis)
    let sessionDeleted = false;
    
    if (req.sessionId) {
      const result = await invalidateSession(req.sessionId);
      if (result) {
        sessionDeleted = true;
        console.log(`✅ Session invalidated: ${req.sessionId}`);
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

    // Invalidate all sessions for this user (cleanup both MongoDB and Redis)
    const result = await invalidateAllUserSessions(userId);

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
    // ✅ Only for signup flow - send OTP for pending registration
    // (Verified accounts cannot call this, unverified login is rejected at backend)
    
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    // Find a pending registration for this email
    const pending = await PendingRegistration.findOne({ email });
    if (!pending) return res.status(404).json({ success: false, message: "No pending registration found for this email" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpiry = new Date();
    otpExpiry.setHours(otpExpiry.getHours() + 24);
    pending.otp = otp;
    pending.otpExpireAt = otpExpiry;
    await pending.save();

    try {
      const apiKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY || process.env.SIB_API_KEY;
      if (!apiKey) {
        if (process.env.NODE_ENV !== "production") {
          console.log(`DEV OTP for ${pending.email}: ${otp}`);
        } else {
          console.error("BREVO_API_KEY missing - cannot send verification OTP");
          return res.status(500).json({ success: false, message: "Email provider not configured (BREVO_API_KEY missing)" });
        }
      } else {
        const html = `<p>Your OTP is <strong>${otp}</strong>. Verify your account using this OTP.</p>`;
        await sendTransactionalEmail({ to: pending.email, subject: "Account Verification OTP", html, senderEmail: process.env.SENDER_EMAIL });
      }
    } catch (mailErr) {
      console.error("[Email] Failed to send verification OTP:", mailErr?.message || mailErr);
      return res.status(500).json({ success: false, message: "Failed to send OTP email. Please try again." });
    }

    return res.json({ success: true, message: "Verification OTP sent on email" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    // Accept either { otp } (legacy find user by otp) OR { email, otp } for pending registration flow
    const { otp, email } = req.body;
    if (!otp) return res.status(400).json({ success: false, message: "Missing OTP" });

    // First try to find a pending registration matching email+otp (preferred)
    if (email) {
      const pending = await PendingRegistration.findOne({ email, otp });
      if (!pending) return res.status(400).json({ success: false, message: "Invalid OTP or email" });
      if (pending.otpExpireAt < Date.now()) return res.status(400).json({ success: false, message: "OTP expired" });

      // Create the real user now
      const uniqueUsername = await buildUniqueUsername(pending.name);
      const user = new User({
        name: pending.name,
        email: pending.email,
        password: pending.password,
        username: uniqueUsername,
        acceptedTC: pending.acceptedTC,
        isAccountVerified: true,
      });
      await user.save();

      // Auto-unlock welcome badge for new users on signup
      try {
        await checkAndUnlockBadge(user._id, 'welcome');
        console.log(`✅ Welcome badge unlocked for new user: ${user._id}`);
      } catch (badgeError) {
        console.error(`⚠️ Failed to unlock welcome badge: ${badgeError.message}`);
        // Don't fail registration if badge unlock fails
      }

      // Delete pending
      await PendingRegistration.findByIdAndDelete(pending._id);

      // Create session and set cookies (log user in)
      const sessionData = await createSession(user._id, req);
      setSessionCookies(res, sessionData.accessToken, sessionData.refreshToken);
      const legacyToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      res.cookie("token", legacyToken, legacyCookieOptions);

      return res.json({
        success: true,
        message: "Email verified and account created.",
        user: {
          _id: user._id,
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          isAccountVerified: user.isAccountVerified,
          accountStatus: user.accountStatus,
          lastActive: user.lastActive,
          level: user.level,
          rank: user.rank,
          xp: user.xp,
          avatar: user.avatar,
        },
        sessionId: sessionData.sessionId,
        accessToken: sessionData.accessToken,
        refreshToken: sessionData.refreshToken,
      });
    }

    // Fallback: existing user verification by otp
    const user = await User.findOne({ verifyotp: otp });
    if (!user) return res.status(400).json({ success: false, message: "Invalid OTP" });
    if (user.verifyotpExpireAt < Date.now()) return res.status(400).json({ success: false, message: "OTP expired" });

    user.isAccountVerified = true;
    user.verifyotp = "";
    user.verifyotpExpireAt = null;
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
            _id: req.user._id,
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            username: req.user.username,
            isAccountVerified: req.user.isAccountVerified,
            accountStatus: req.user.accountStatus,
            lastActive: req.user.lastActive,
            level: req.user.level,
            rank: req.user.rank,
            xp: req.user.xp,
            avatar: req.user.avatar,
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
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);
    user.resetotp = otp;
    user.resetotpExpireAt = otpExpiry;
    await user.save();

    try {
      const apiKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY || process.env.SIB_API_KEY;
      if (!apiKey) {
        if (process.env.NODE_ENV !== "production") {
          console.log(`DEV OTP for ${user.email}: ${otp}`);
        } else {
          console.error("BREVO_API_KEY missing - cannot send password reset OTP");
          return res.status(500).json({ success: false, message: "Email provider not configured (BREVO_API_KEY missing)" });
        }
      } else {
        const html = `<p>Your OTP for password reset is <strong>${otp}</strong>. It will expire in 15 minutes.</p>`;
        await sendTransactionalEmail({ to: user.email, subject: "Password Reset OTP", html, senderEmail: process.env.SENDER_EMAIL });
      }
    } catch (mailErr) {
      console.error("[Email] Failed to send password reset OTP:", mailErr?.message || mailErr);
      return res.status(500).json({ success: false, message: "Failed to send OTP email. Please try again." });
    }

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
    user.resetotpExpireAt = null;
    await user.save();

    return res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};