import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  editEmail,
  changeEmail,
  configureEmailSettings,
  getProfileSettings,
  updateEmail,
  updatePassword,
  updateNotificationSettings,
} from "./controller.js";
import userAuth from "../auth/middleware.js";
import uploadAvatarMulter from "./multer.config.js";

import { equipItem } from "./controller.js";
import authMiddleware from "../auth/middleware.js";

const router = express.Router();


// Profile Routes (All require authentication via userAuth)

// Get user profile
router.get("/profile", userAuth, getUserProfile);

// Get profile settings (for account settings page)
router.get("/settings", userAuth, getProfileSettings);

// Update profile (name, bio, preset avatar)
router.put("/", userAuth, updateUserProfile);

// Upload custom avatar (file upload)
router.put("/avatar", userAuth, uploadAvatarMulter.single("avatar"), uploadAvatar);

// Email management (new endpoints)
router.put("/email", userAuth, updateEmail);
router.put("/password", userAuth, updatePassword);
router.put("/notifications", userAuth, updateNotificationSettings);

// Legacy email management (kept for backward compatibility)
router.put("/email/edit", userAuth, editEmail);
router.put("/email/change", userAuth, changeEmail);
router.put("/email/configure", userAuth, configureEmailSettings);

// Test route
router.get("/test", (_req, res) => res.send("✅ Profile routes working"));

router.post("/equip-item", authMiddleware, equipItem);

export default router;