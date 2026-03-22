import mongoose from "mongoose";
import Stripe from "stripe";

import ShopItem from "./ShopItem.model.js";
import Inventory from "./Inventory.model.js";
import Purchase from "./Purchase.model.js";
import User from "../auth/User.model.js";

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return new Stripe(secretKey);
};

// ------------------------------------------------------------
// Buy item with Tokens / Free
// ------------------------------------------------------------
export const purchaseItemWithTokens = async (userId, itemId) => {
  const session = await mongoose.startSession();

  try {
    let result = null;

    await session.withTransaction(async () => {
      const item = await ShopItem.findById(itemId).session(session);

      if (!item || !item.isActive) {
        throw new Error("Item not found or inactive");
      }

      if (!item.pricing || !["free", "tokens"].includes(item.pricing.type)) {
        throw new Error("This item is not available for token purchase");
      }

      const existingInventory = await Inventory.findOne({ userId, itemId }).session(session);

      if (existingInventory) {
        throw new Error("You already own this item");
      }

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

      user.tokens = currentTokens - priceTokens;
      await user.save({ session });

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

      await Purchase.create(
        [
          {
            userId,
            itemId,
            itemName: item.name,
            price: priceTokens,
            xpAfterPurchase: user.tokens, // ✅ fixed naming
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
    if (err?.code === 11000) {
      throw new Error("You already own this item");
    }
    throw err;
  } finally {
    session.endSession();
  }
};

// ------------------------------------------------------------
// Get active shop items
// ------------------------------------------------------------
export const getShopItems = async (category) => {
  const filter = { isActive: true };

  if (category && category !== "all") {
    filter.category = category;
  }

  return await ShopItem.find(filter).sort({ createdAt: -1 });
};

// ------------------------------------------------------------
// Get logged-in user's inventory
// ------------------------------------------------------------
export const getMyInventory = async (userId, category) => {
  const filter = { userId };

  if (category && category !== "all") {
    filter.category = category;
  }

  return await Inventory.find(filter)
    .populate("itemId")
    .sort({ createdAt: -1 });
};

// ------------------------------------------------------------
// Create Stripe checkout session
// ------------------------------------------------------------
export const createCheckoutSession = async (userId, itemId) => {
  const stripe = getStripe();

  const item = await ShopItem.findById(itemId);

  if (!item || !item.isActive) {
    throw new Error("Item not found or inactive");
  }

  if (!item.pricing || item.pricing.type !== "paid") {
    throw new Error("This item is not available for paid checkout");
  }

  const existingInventory = await Inventory.findOne({ userId, itemId });

  if (existingInventory) {
    throw new Error("You already own this item");
  }

  const amount = Number(item.pricing.amount || 0);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid paid item price");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    client_reference_id: String(userId),

    metadata: {
      userId: String(userId),
      itemId: String(item._id),
      itemName: item.name, // ✅ added
    },

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description || undefined,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],

    success_url: `${process.env.CLIENT_URL}/store?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/store?payment=cancelled`,
  });

  return {
    success: true,
    url: session.url,
    sessionId: session.id,
  };
};

// ------------------------------------------------------------
// Finalize Stripe purchase (IDEMPOTENT)
// ------------------------------------------------------------
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

      // ✅ already processed (purchase exists)
      const existingPurchase = await Purchase.findOne({
        stripeSessionId,
      }).session(session);

      if (existingPurchase) {
        result = { success: true, alreadyProcessed: true };
        return;
      }

      // ✅ already processed (inventory exists)
      const existingInventory = await Inventory.findOne({
        userId,
        itemId,
      }).session(session);

      if (existingInventory) {
        result = { success: true, alreadyProcessed: true };
        return;
      }

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

      await Purchase.create(
        [
          {
            userId,
            itemId,
            itemName: item.name,
            price: Number(item.pricing?.amount || 0),
            stripeSessionId,
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
    if (err?.code === 11000) {
      return { success: true, alreadyProcessed: true };
    }
    throw err;
  } finally {
    session.endSession();
  }
};