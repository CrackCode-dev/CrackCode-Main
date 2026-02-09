import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  editEmail,
  changeEmail,
  configureEmailSettings,
} from "./controller.js";
import userAuth from "../auth/middleware.js";
import uploadAvatarMulter from "./multer.config.js";

const router = express.Router();

// ═════════════════════════════════════════════════════════════
// Profile Routes (All require authentication via userAuth)
// ═════════════════════════════════════════════════════════════

// Get user profile
router.get("/profile", userAuth, getUserProfile);

// Update profile (name, bio, preset avatar)
router.put("/", userAuth, updateUserProfile);

// Upload custom avatar (file upload)
router.put("/avatar", userAuth, uploadAvatarMulter.single("avatar"), uploadAvatar);

// Email management
router.put("/email/edit", userAuth, editEmail);
router.put("/email/change", userAuth, changeEmail);
router.put("/email/configure", userAuth, configureEmailSettings);

// Test route
router.get("/test", (_req, res) => res.send("✅ Profile routes working"));

export default router;