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

// Stripe webhook route
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookController
);

// Public: view store items
router.get("/items", listItems);

// Protected: buy item
router.post("/purchase", authMiddleware, purchaseItem);

// Protected: get user's inventory
router.get("/inventory", authMiddleware, myInventory);

// Protected: create Stripe checkout session
router.post("/checkout", authMiddleware, createCheckoutSessionController);

export default router;