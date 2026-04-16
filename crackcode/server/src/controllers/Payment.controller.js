/**
 * Payment.controller.js — handles post-payment verification and Stripe webhooks.
 *
 * Flow for a paid item purchase:
 *  1. Client calls POST /shop/checkout  → Shop.service creates a Stripe checkout session
 *                                          with userId + itemId stored in session.metadata
 *  2. User completes payment on Stripe's hosted page
 *  3. Stripe redirects back to /store?payment=success&session_id=...
 *  4. Client calls GET /api/payment/verify-session?session_id=...  ← handled here
 *  5. This controller retrieves the session from Stripe, confirms payment_status === "paid",
 *     then grants the item to the user by writing to Inventory + Purchase collections.
 */

import Stripe from "stripe";
import Inventory from "../modules/shop/Inventory.model.js";
import Purchase from "../modules/shop/Purchase.model.js";
import ShopItem from "../modules/shop/ShopItem.model.js";

// Initialise the Stripe SDK with the secret key from environment variables.
// Never expose this key on the client side.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * GET /api/payment/verify-session?session_id=...
 *
 * Called by the client after Stripe redirects the user back to the app.
 * Retrieves the Stripe checkout session, confirms it was paid, then
 * grants the purchased item to the user (adds to Inventory + logs a Purchase).
 *
 * Idempotent: if the item is already in the user's inventory or the purchase
 * record already exists, it skips creation — so re-calling this endpoint is safe.
 */
export const verifyStripeSession = async (req, res) => {
  try {
    const { session_id } = req.query;

    console.log("verify route hit");
    console.log("session_id:", session_id);

    // Reject requests that are missing the session ID
    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: "session_id is required",
      });
    }

    // Retrieve the full checkout session object from Stripe using the session ID.
    // This is the authoritative source — never trust client-side payment status alone.
    const session = await stripe.checkout.sessions.retrieve(session_id);

    console.log("stripe session metadata:", session.metadata);
    console.log("stripe payment status:", session.payment_status);

    // Only proceed if Stripe confirms the payment was actually completed.
    // payment_status can be "paid", "unpaid", or "no_payment_required".
    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    // userId and itemId were embedded in the session when the checkout was created
    // (see Shop.service.js → createCheckoutSession → metadata field).
    const userId = session.metadata?.userId;
    const itemId = session.metadata?.itemId;

    console.log("userId:", userId);
    console.log("itemId:", itemId);

    // Both values must be present — if missing, the session was created incorrectly
    if (!userId || !itemId) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or itemId in Stripe metadata",
      });
    }

    // --- Grant the item to the user (idempotent) ---

    // Check if the user already has this item in their inventory.
    // This guards against duplicate grants if the endpoint is called more than once
    // (e.g. user refreshes the success page).
    const existingInventoryItem = await Inventory.findOne({ userId, itemId });

    if (!existingInventoryItem) {
      // Look up the shop item to get its category and price details
      const item = await ShopItem.findById(itemId);
      if (!item) {
        return res.status(404).json({ success: false, message: "Shop item not found" });
      }

      // Add the item to the user's inventory
      await Inventory.create({
        userId,
        itemId,
        category: item.category,
      });

      // Log the purchase record — but only if one doesn't already exist for this session.
      // stripeSessionId is used as a unique key to prevent duplicate purchase records.
      const existingPurchase = await Purchase.findOne({ stripeSessionId: session_id });
      if (!existingPurchase) {
        await Purchase.create({
          userId,
          itemId,
          itemName: item.name,
          price: Number(item.pricing?.amount || 0),
          stripeSessionId: session_id, // Stored so we can match refunds/disputes later
          paymentMethod: "stripe",
          currency: "usd",
        });
      }
    }
    // If the item was already in inventory, silently skip — still return success
    // so the client can continue as normal (handles browser back/refresh safely).

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully and inventory updated",
    });
  } catch (error) {
    console.error("Verify Stripe session error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify payment session",
    });
  }
};

/**
 * POST /api/payment/webhook
 *
 * Stripe webhook endpoint — intended to receive real-time payment events
 * directly from Stripe (e.g. payment_intent.succeeded, checkout.session.completed).
 *
 * Currently a stub (returns 200 immediately). A full implementation would:
 *  1. Verify the Stripe-Signature header to confirm the request is from Stripe
 *  2. Parse the event type and handle relevant events (e.g. grant item on session completed)
 *
 * Webhooks are useful as a fallback in case the client-side verify-session call fails.
 */
export const stripeWebhook = async (req, res) => {
  try {
    // TODO: implement webhook signature verification and event handling
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return res.status(500).json({
      success: false,
      message: "Webhook failed",
    });
  }
};
