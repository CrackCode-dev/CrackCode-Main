import express from "express";
import { getProgress } from "./progress.controller.js";

const router = express.Router();

router.get("/", getProgress);

export default router;
