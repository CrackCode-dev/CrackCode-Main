import express from "express";
import { getUserProfile, updateUserProfile, uploadAvatar, editEmail, changeEmail, configureEmailSettings } from "../controllers/profileController.js";
import userAuth from "../middleware/userAuth.js"; //  fixed path
import uploadAvatarMulter from "../config/multer.js";

console.log("profileRoutes loaded");

const router = express.Router();

// Get logged-in user profile
router.get("/profile", userAuth, getUserProfile);

// Update profile
router.put("/", userAuth, updateUserProfile);

// Upload avatar
router.put("/avatar", userAuth, uploadAvatarMulter.single("avatar"), uploadAvatar);

// Account/email settings
router.put("/email/edit", userAuth, editEmail);
router.put("/email/change", userAuth, changeEmail);
router.put("/email/configure", userAuth, configureEmailSettings);

// Test route
router.get("/test", (req, res) => res.send("profile routes working"));

export default router;
