import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/profileController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.get("/", userAuth, getUserProfile);
router.put("/", userAuth, updateUserProfile);

export default router;
