import express from "express";
import userAuth from "../auth/middleware.js";
import { sendTestEmail } from "./brevo.controller.js";

const router = express.Router();

// POST /api/admin/brevo/send - requires authenticated admin user
router.post("/send", userAuth, sendTestEmail);

export default router;
