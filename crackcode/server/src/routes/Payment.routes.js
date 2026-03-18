import express from "express";
import { stripeWebhook } from "../controllers/Payment.controller.js";

const router = express.Router();

// Stripe webhook endpoint
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;