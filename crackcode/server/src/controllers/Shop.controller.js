/**
 * Shop.controller.js — HTTP controllers for all shop-related routes.
 *
 * Each controller is a thin layer that:
 *   1. Extracts and validates input from the request
 *   2. Delegates business logic to Shop.service.js
 *   3. Maps service errors to appropriate HTTP status codes
 *
 * Routes handled here:
 *   POST /api/shop/purchase  → purchaseItem                 (buy with tokens)
 *   GET  /api/shop/items     → listItems                    (browse store)
 *   GET  /api/shop/inventory → myInventory                  (user's owned items)
 *   POST /api/shop/checkout  → createCheckoutSessionController (start Stripe payment)
 *   POST /api/shop/webhook   → stripeWebhookController      (Stripe event listener)
 */

import Stripe from "stripe";

// Lazily initialises Stripe only when needed — throws early with a clear message
// if the secret key is missing from environment variables.
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

import {
  purchaseItemWithTokens,  // Handles token (in-app currency) purchases
  getShopItems,            // Fetches all active store items
  getMyInventory,          // Fetches items the user already owns
  createCheckoutSession,   // Creates a Stripe checkout session for paid items
  finalizePaidPurchase,    // Grants a paid item to the user after Stripe confirms payment
} from "../modules/shop/Shop.service.js";

// Helper to extract userId from the authenticated request.
// Supports both Mongoose ObjectId (_id) and plain string id formats.
const getUserId = (req) => req.user?._id || req.user?.id;

/**
 * POST /api/shop/purchase
 * Body: { itemId }
 * Auth: required
 *
 * Purchases an item using the user's in-app tokens.
 * Delegates to purchaseItemWithTokens which validates the balance,
 * deducts tokens, and adds the item to the user's inventory.
 *
 * Error mapping:
 *   "not found" / "inactive"  → 404
 *   "unauthorized"            → 401
 *   "not enough/insufficient" → 400 (not enough tokens)
 *   "already own"             → 400 (duplicate purchase)
 */
export const purchaseItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { itemId } = req.body || {};
    if (!itemId) {
      return res
        .status(400)
        .json({ success: false, message: "itemId is required" });
    }

    const result = await purchaseItemWithTokens(userId, itemId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Purchase error:", error);

    // Map service-layer error messages to semantic HTTP status codes
    const msg = error?.message || "Purchase failed";

    if (/not found|inactive/i.test(msg)) {
      return res.status(404).json({ success: false, message: msg });
    }
    if (/unauthorized/i.test(msg)) {
      return res.status(401).json({ success: false, message: msg });
    }
    if (/not enough|insufficient/i.test(msg)) {
      return res.status(400).json({ success: false, message: msg });
    }
    if (/already own/i.test(msg)) {
      return res.status(400).json({ success: false, message: msg });
    }

    return res.status(400).json({ success: false, message: msg });
  }
};

/**
 * GET /api/shop/items?category=avatar|theme|title|all
 * Auth: not required
 *
 * Returns all active shop items, optionally filtered by category.
 * No auth needed — the store catalogue is publicly browsable.
 */
export const listItems = async (req, res) => {
  try {
    const { category } = req.query || {};
    const items = await getShopItems(category);
    return res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("List items error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to fetch items",
    });
  }
};

/**
 * GET /api/shop/inventory?category=avatar|theme|title|all
 * Auth: required
 *
 * Returns the authenticated user's inventory (items they already own),
 * optionally filtered by category.
 */
export const myInventory = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { category } = req.query || {};
    const items = await getMyInventory(userId, category);

    return res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("Inventory error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to fetch inventory",
    });
  }
};

/**
 * POST /api/shop/checkout
 * Body: { itemId }
 * Auth: required
 *
 * Creates a Stripe checkout session for a paid item and returns { url, sessionId }.
 * The client redirects the user to the url (Stripe's hosted payment page).
 * After payment, Stripe redirects back to /store?payment=success&session_id=...
 *
 * userId and itemId are stored in session.metadata so they can be retrieved
 * later by the webhook or verify-session endpoint to grant the item.
 *
 * Error mapping:
 *   "already own"            → 400
 *   "not found" / "inactive" → 404
 *   "unauthorized"           → 401
 */
export const createCheckoutSessionController = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { itemId } = req.body || {};
    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "itemId is required",
      });
    }

    // Returns { url, sessionId } — client uses url to redirect to Stripe's payment page
    const session = await createCheckoutSession(userId, itemId);

    return res.status(200).json(session);
  } catch (err) {
    const msg = err?.message || "Stripe checkout failed";

    if (/already own/i.test(msg)) {
      return res.status(400).json({ success: false, message: msg });
    }
    if (/not found|inactive/i.test(msg)) {
      return res.status(404).json({ success: false, message: msg });
    }
    if (/unauthorized/i.test(msg)) {
      return res.status(401).json({ success: false, message: msg });
    }

    return res.status(400).json({ success: false, message: msg });
  }
};

/**
 * POST /api/shop/webhook
 * Auth: none — verified via Stripe-Signature header instead
 *
 * Receives real-time payment events pushed directly from Stripe (server-to-server).
 * Stripe signs each request with STRIPE_WEBHOOK_SECRET so we can verify authenticity.
 *
 * Why webhooks in addition to verify-session?
 *   verify-session relies on the client calling back after the redirect.
 *   If the user closes the tab before the redirect completes, the item would never
 *   be granted. Webhooks fire independently of the client, acting as a reliable
 *   fallback to guarantee item delivery.
 *
 * Currently handles: "checkout.session.completed"
 *   - Verifies the Stripe-Signature header (rejects tampered requests)
 *   - Extracts userId + itemId from session.metadata
 *   - Calls finalizePaidPurchase to add the item to Inventory + log a Purchase record
 *
 * Special case: if the user already owns the item (verify-session already ran),
 *   returns 200 instead of 500 — Stripe retries on non-2xx, so duplicate events
 *   must be acknowledged gracefully.
 */
export const stripeWebhookController = async (req, res) => {
  console.log("=== STRIPE WEBHOOK HIT ===");

  const signature = req.headers["stripe-signature"];
  console.log("Signature exists:", !!signature);

  let event;

  try {
    const stripe = getStripe();

    // constructEvent verifies the webhook signature using STRIPE_WEBHOOK_SECRET.
    // req.body must be the raw buffer (not parsed JSON) — the route applies
    // express.raw() middleware before this controller for exactly this reason.
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("Webhook event type:", event.type);
  } catch (err) {
    // Signature mismatch — request is not from Stripe or was tampered with
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("Checkout session completed:", session.id);
      console.log("Metadata:", session.metadata);

      // Extract user and item from metadata embedded during checkout session creation
      const userId = session.metadata?.userId;
      const itemId = session.metadata?.itemId;
      const stripeSessionId = session.id;

      if (!userId || !itemId) {
        console.error("Missing metadata:", { userId, itemId });
        return res.status(400).json({
          success: false,
          message: "Missing userId or itemId in Stripe metadata",
        });
      }

      // Grant the item: adds to Inventory + creates a Purchase record
      await finalizePaidPurchase({
        userId,
        itemId,
        stripeSessionId,
      });

      console.log("finalizePaidPurchase completed successfully");
    }
    // Other event types are ignored — always acknowledge with 200

    // Must return 200 so Stripe knows the event was received.
    // Stripe will keep retrying until it gets a 2xx response.
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Stripe webhook processing failed:", err);

    const msg = err?.message || "Webhook processing failed";

    // Return 200 for "already owns" to stop Stripe retrying this event.
    // This handles the case where verify-session already granted the item.
    if (/already own/i.test(msg)) {
      return res.status(200).json({
        success: true,
        message: "User already owns this item",
      });
    }

    return res.status(500).json({
      success: false,
      message: msg,
    });
  }
};