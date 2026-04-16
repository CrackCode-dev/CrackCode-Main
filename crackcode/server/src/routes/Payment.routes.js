/**
 * Payment.routes.js — routes mounted at /api/payment
 *
 * These routes handle the post-payment flow after a user completes (or cancels)
 * a Stripe checkout session.
 *
 * Route summary:
 *   GET  /api/payment/verify-session?session_id=...  — client calls this after Stripe redirects back
 *   POST /api/payment/webhook                        — Stripe calls this directly (server-to-server)
 *
 * Both routes ultimately grant the purchased item to the user, but serve different purposes:
 *   verify-session → triggered by the client after the redirect, fast feedback to the user
 *   webhook        → triggered by Stripe directly, acts as a reliable fallback
 */

import express from "express";
import {
  stripeWebhook,
  verifyStripeSession,
} from "../controllers/Payment.controller.js";

const router = express.Router();

// GET /api/payment/verify-session?session_id=...
// Called by the client (DetectiveStore.jsx) after Stripe redirects the user back to the app.
// Retrieves the Stripe session, confirms payment was made, then grants the item to the user.
// No auth middleware — the userId is read from the Stripe session metadata instead.
router.get("/verify-session", verifyStripeSession);

// POST /api/payment/webhook
// Called directly by Stripe (not the browser) when a payment event occurs.
// express.raw() is required here — Stripe's signature verification needs the raw request
// body as a Buffer, not a parsed JSON object. Using express.json() would break verification.
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;