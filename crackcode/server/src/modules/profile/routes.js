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

router.get("/profile", userAuth, getUserProfile);
router.put("/", userAuth, updateUserProfile);
router.put("/avatar", userAuth, uploadAvatarMulter.single("avatar"), uploadAvatar);
router.put("/email/edit", userAuth, editEmail);
router.put("/email/change", userAuth, changeEmail);
router.put("/email/configure", userAuth, configureEmailSettings);
router.get("/test", (_req, res) => res.send("profile routes working"));

export default router;
