/**
 * Shop.routes.js — routes mounted at /api/shop
 *
 * Route summary:
 *   POST /api/shop/webhook   — Stripe webhook (no auth, signature-verified)
 *   GET  /api/shop/items     — browse store items (public, no auth)
 *   POST /api/shop/purchase  — buy an item with tokens (auth required)
 *   GET  /api/shop/inventory — view owned items (auth required)
 *   POST /api/shop/checkout  — create a Stripe checkout session (auth required)
 *
 * Auth: routes that involve a specific user's data are protected by authMiddleware,
 * which verifies the JWT and attaches req.user before the controller runs.
 * The webhook and items listing are intentionally public.
 */

import express from "express";
import authMiddleware from "../modules/auth/middleware.js";

import {
  purchaseItem,
  listItems,
  myInventory,
  createCheckoutSessionController,
  stripeWebhookController,
} from "../controllers/Shop.controller.js";

const router = express.Router();

// POST /api/shop/webhook
// Receives real-time payment events from Stripe (server-to-server, not from the browser).
// IMPORTANT: express.raw() must be applied before the controller — Stripe's signature
// verification requires the raw request body Buffer. Parsed JSON will break it.
// This route has NO auth middleware — Stripe authenticates via the Stripe-Signature header.
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookController
);

// GET /api/shop/items?category=avatar|theme|...
// Returns all active store items. Public — no login required to browse the store.
router.get("/items", listItems);

// POST /api/shop/purchase  — Body: { itemId }
// Buys an item using the user's in-app tokens. Deducts tokens and adds to inventory atomically.
// authMiddleware verifies the JWT and sets req.user so the controller knows who is buying.
router.post("/purchase", authMiddleware, purchaseItem);

// GET /api/shop/inventory?category=avatar|theme|...
// Returns all items the authenticated user currently owns (their inventory).
router.get("/inventory", authMiddleware, myInventory);

// POST /api/shop/checkout  — Body: { itemId }
// Creates a Stripe checkout session for a real-money (paid) item.
// Returns { url, sessionId } — the client redirects the user to url to complete payment.
// After payment, Stripe redirects to /store?payment=success&session_id=...
router.post("/checkout", authMiddleware, createCheckoutSessionController);

export default router;