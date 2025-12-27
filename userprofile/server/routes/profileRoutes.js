import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/profileController.js";
import userAuth from "../middleware/userAuth.js";
import { uploadAvatar } from "../controllers/profileController.js";
import uploadAvatarMulter from "../configs/multer.js";
import {
  editEmail,
  changeEmail,
  configureEmailSettings
} from "../controllers/profileController.js";


const router = express.Router();

router.get("/", userAuth, getUserProfile);
router.put("/", userAuth, updateUserProfile);

// Upload avatar
router.put(
  "/avatar",
  userAuth,
  uploadAvatarMulter.single("avatar"),
  uploadAvatar
);


// Account settings
router.put("/email/edit", userAuth, editEmail);
router.put("/email/change", userAuth, changeEmail);
router.put("/email/configure", userAuth, configureEmailSettings);


export default router;


