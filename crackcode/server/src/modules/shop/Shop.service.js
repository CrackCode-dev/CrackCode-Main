/**
 * Shop.service.js — all business logic for the store.
 *
 * This is the single source of truth for purchase rules, inventory management,
 * and Stripe session creation. Controllers in Shop.controller.js and
 * Payment.controller.js delegate to these functions.
 *
 * Exported functions:
 *   purchaseItemWithTokens  — buy an item using in-app tokens (atomic DB transaction)
 *   getShopItems            — fetch active store items, optionally filtered by category
 *   getMyInventory          — fetch a user's owned items, optionally filtered by category
 *   createCheckoutSession   — create a Stripe checkout session for a paid item
 *   finalizePaidPurchase    — grant a paid item after Stripe confirms payment (idempotent)
 */

import mongoose from "mongoose";
import Stripe from "stripe";

import ShopItem from "./ShopItem.model.js";
import Inventory from "./Inventory.model.js";
import Purchase from "./Purchase.model.js";
import User from "../auth/User.model.js";

// Lazily initialises Stripe — throws early with a clear message if the key is missing
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return new Stripe(secretKey);
};

// ------------------------------------------------------------
// purchaseItemWithTokens — buy an item using in-app tokens
// ------------------------------------------------------------
/**
 * Purchases a free or token-priced item for a user inside a MongoDB transaction.
 * Using a transaction ensures that the token deduction and inventory creation
 * either both succeed or both fail — no partial state is left behind.
 *
 * Steps:
 *   1. Find the item and verify it's active and token-purchasable
 *   2. Check the user doesn't already own it (also enforced by the DB unique index)
 *   3. Verify the user has enough tokens
 *   4. Deduct tokens from the user's balance
 *   5. Create the Inventory record (ownership)
 *   6. Create the Purchase record (audit log)
 *
 * Returns: { success, remainingTokens, inventoryItem }
 * Throws:  descriptive Error messages that Shop.controller maps to HTTP status codes
 */
export const purchaseItemWithTokens = async (userId, itemId) => {
  const session = await mongoose.startSession();

  try {
    let result = null;

    await session.withTransaction(async () => {
      const item = await ShopItem.findById(itemId).session(session);

      if (!item || !item.isActive) {
        throw new Error("Item not found or inactive");
      }

      // Only "free" and "tokens" (xp) pricing types can be bought with tokens
      if (!item.pricing || !["free", "tokens"].includes(item.pricing.type)) {
        throw new Error("This item is not available for token purchase");
      }

      // Check ownership — also enforced by the DB unique index as a safety net
      const existingInventory = await Inventory.findOne({ userId, itemId }).session(session);

      if (existingInventory) {
        throw new Error("You already own this item");
      }

      // Free items cost 0 tokens; xp items cost their listed amount
      const priceTokens =
        item.pricing.type === "free" ? 0 : Number(item.pricing.amount || 0);

      if (!Number.isFinite(priceTokens) || priceTokens < 0) {
        throw new Error("Invalid item price");
      }

      const user = await User.findById(userId).session(session);

      if (!user) {
        throw new Error("User not found");
      }

      const currentTokens = Number(user.tokens || 0);

      if (currentTokens < priceTokens) {
        throw new Error("Not enough tokens");
      }

      // Deduct tokens atomically within the transaction
      user.tokens = currentTokens - priceTokens;
      await user.save({ session });

      // Grant the item — Inventory.create uses an array + session for transaction support
      const createdInventory = await Inventory.create(
        [
          {
            userId,
            itemId,
            category: item.category,
            quantity: 1,
          },
        ],
        { session }
      );

      // Log the purchase for audit/history purposes
      await Purchase.create(
        [
          {
            userId,
            itemId,
            itemName: item.name,
            price: priceTokens,
            xpAfterPurchase: user.tokens, // Remaining balance after deduction
            paymentMethod: "xp",
            currency: "tokens",
          },
        ],
        { session }
      );

      result = {
        success: true,
        remainingTokens: user.tokens,
        inventoryItem: createdInventory[0],
      };
    });

    return result;
  } catch (err) {
    // MongoDB duplicate key error (code 11000) means the unique index on (userId, itemId) fired.
    // Convert to a user-friendly message instead of leaking a raw DB error.
    if (err?.code === 11000) {
      throw new Error("You already own this item");
    }
    throw err;
  } finally {
    // Always end the session to release the MongoDB connection back to the pool
    session.endSession();
  }
};

// ------------------------------------------------------------
// getShopItems — fetch all active items from the store
// ------------------------------------------------------------
/**
 * Returns all active ShopItems, optionally filtered by category.
 * Sorted newest first so newly added items appear at the top of the store.
 *
 * @param {string} category - "avatar", "theme", etc. or undefined/"all" for no filter
 */
export const getShopItems = async (category) => {
  const filter = { isActive: true }; // Never return inactive/hidden items

  if (category && category !== "all") {
    filter.category = category;
  }

  return await ShopItem.find(filter).sort({ createdAt: -1 });
};

// ------------------------------------------------------------
// getMyInventory — fetch a user's owned items
// ------------------------------------------------------------
/**
 * Returns all Inventory records for a user, with the full ShopItem populated.
 * Sorted newest first so recently purchased items appear at the top.
 *
 * .populate("itemId") replaces the itemId ObjectId with the full ShopItem document,
 * so the client receives the item's name, imageUrl, category etc. in one call.
 *
 * @param {string} userId   - the user whose inventory to fetch
 * @param {string} category - optional filter by item category
 */
export const getMyInventory = async (userId, category) => {
  const filter = { userId };

  if (category && category !== "all") {
    filter.category = category;
  }

  return await Inventory.find(filter)
    .populate("itemId")   // Join with ShopItem to get full item details
    .sort({ createdAt: -1 });
};

// ------------------------------------------------------------
// createCheckoutSession — start a Stripe payment for a paid item
// ------------------------------------------------------------
/**
 * Creates a Stripe checkout session for a real-money (paid) item.
 * Returns { success, url, sessionId } — the client redirects the user to `url`.
 *
 * userId and itemId are stored in session.metadata so the webhook /
 * verify-session endpoint can retrieve them after payment completes.
 *
 * success_url: where Stripe redirects on successful payment
 *              → /store?payment=success&session_id={CHECKOUT_SESSION_ID}
 * cancel_url:  where Stripe redirects if the user cancels
 *              → /store?payment=cancelled
 *
 * unit_amount is in cents (Stripe standard) — multiply USD amount by 100.
 */
export const createCheckoutSession = async (userId, itemId) => {
  const stripe = getStripe();

  const item = await ShopItem.findById(itemId);

  if (!item || !item.isActive) {
    throw new Error("Item not found or inactive");
  }

  // Only "paid" items can go through Stripe checkout
  if (!item.pricing || item.pricing.type !== "paid") {
    throw new Error("This item is not available for paid checkout");
  }

  // Prevent creating a checkout session for an item the user already owns
  const existingInventory = await Inventory.findOne({ userId, itemId });

  if (existingInventory) {
    throw new Error("You already own this item");
  }

  const amount = Number(item.pricing.amount || 0);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid paid item price");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",                          // One-time payment (not a subscription)
    payment_method_types: ["card"],           // Only accept card payments
    client_reference_id: String(userId),      // Optional Stripe reference for reconciliation

    // Metadata is stored on the Stripe session and returned in webhook events.
    // This is how we know which user bought which item when Stripe calls back.
    metadata: {
      userId: String(userId),
      itemId: String(item._id),
      itemName: item.name,
    },

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description || undefined,
          },
          unit_amount: Math.round(amount * 100), // Convert dollars → cents (Stripe requires cents)
        },
        quantity: 1,
      },
    ],

    // {CHECKOUT_SESSION_ID} is a Stripe template placeholder — replaced with the real session ID at runtime
    success_url: `${process.env.CLIENT_URL}/store?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/store?payment=cancelled`,
  });

  return {
    success: true,
    url: session.url,        // Redirect the user here to complete payment
    sessionId: session.id,
  };
};

// ------------------------------------------------------------
// finalizePaidPurchase — grant item after Stripe confirms payment (IDEMPOTENT)
// ------------------------------------------------------------
/**
 * Called by the webhook and/or verify-session endpoint after Stripe confirms payment.
 * Adds the item to the user's Inventory and logs a Purchase record.
 *
 * Idempotent — safe to call multiple times for the same session:
 *   - If a Purchase record with this stripeSessionId already exists → skip, return success
 *   - If an Inventory record for (userId, itemId) already exists    → skip, return success
 *   - MongoDB duplicate key error (code 11000)                      → also treated as success
 *
 * This handles the common case where both the webhook AND verify-session fire for the
 * same purchase — whichever runs second simply finds the records and exits early.
 *
 * Uses a MongoDB transaction so Inventory + Purchase are created atomically.
 */
export const finalizePaidPurchase = async ({
  userId,
  itemId,
  stripeSessionId,
}) => {
  const session = await mongoose.startSession();

  try {
    let result = null;

    await session.withTransaction(async () => {
      const item = await ShopItem.findById(itemId).session(session);

      if (!item || !item.isActive) {
        throw new Error("Item not found or inactive");
      }

      // Guard 1: check if this Stripe session was already processed
      const existingPurchase = await Purchase.findOne({
        stripeSessionId,
      }).session(session);

      if (existingPurchase) {
        result = { success: true, alreadyProcessed: true };
        return; // Exit transaction early — nothing to do
      }

      // Guard 2: check if the user already has the item in inventory
      const existingInventory = await Inventory.findOne({
        userId,
        itemId,
      }).session(session);

      if (existingInventory) {
        result = { success: true, alreadyProcessed: true };
        return; // Exit transaction early — nothing to do
      }

      // Grant the item to the user
      const createdInventory = await Inventory.create(
        [
          {
            userId,
            itemId,
            category: item.category,
            quantity: 1,
          },
        ],
        { session }
      );

      // Log the Stripe purchase for audit/receipt purposes
      await Purchase.create(
        [
          {
            userId,
            itemId,
            itemName: item.name,
            price: Number(item.pricing?.amount || 0),
            stripeSessionId,      // Stored to match refunds/disputes and prevent duplicates
            paymentMethod: "stripe",
            currency: "usd",
          },
        ],
        { session }
      );

      result = {
        success: true,
        inventoryItem: createdInventory[0],
      };
    });

    return result;
  } catch (err) {
    // MongoDB unique index violation — another concurrent call already created the records
    if (err?.code === 11000) {
      return { success: true, alreadyProcessed: true };
    }
    throw err;
  } finally {
    session.endSession();
  }
};
