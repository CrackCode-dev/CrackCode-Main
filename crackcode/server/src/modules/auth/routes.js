import express from "express";
import {
  register,
  login,
  logout,
  logoutAllDevices,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
} from "./controller.js";
import userAuth from "./middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);

// Protected routes (requires userAuth middleware)
router.post("/logout", userAuth, logout);
router.post("/logout-all", userAuth, logoutAllDevices);
// Allow OTP send and verification for both pending registrations and logged-in users
router.post("/send-verify-otp", sendVerifyOtp);
router.post("/verify-account", verifyEmail);
router.get("/is-auth", userAuth, isAuthenticated); // Used for real-time state sync

export default router;