import express from "express";
import { getQuestions } from "./question.controller.js";

const router = express.Router();

router.get("/", getQuestions);

export default router;
