import express from "express";
import userAuth from "../../middleware/auth/userAuth.js";
import { getUserData } from "./controller.js";

const router = express.Router();

router.get("/data", userAuth, getUserData);

export default router;
