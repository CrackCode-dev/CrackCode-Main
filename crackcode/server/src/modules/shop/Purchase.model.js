// Purchase.model.js — an immutable audit log of every completed purchase.
//
// A Purchase record is created whenever a user successfully buys an item,
// either with tokens (paymentMethod: "xp") or via Stripe (paymentMethod: "stripe").
//
// This is separate from Inventory:
//   Inventory = what the user currently owns (source of truth for ownership checks)
//   Purchase  = historical record of every transaction (for receipts, refunds, analytics)

import mongoose from "mongoose";

/**
 * purchaseSchema — records a single completed purchase transaction.
 *
 * Fields:
 *   userId          : the buyer (indexed for fast per-user history queries)
 *   itemId          : the item that was bought
 *   itemName        : snapshot of the item name at purchase time
 *                     (stored so the record is readable even if the item is later renamed)
 *   price           : amount paid — token count for xp purchases, USD value for Stripe
 *   xpAfterPurchase : user's remaining token balance after a token purchase
 *                     (useful for debugging "I didn't have enough tokens" disputes)
 *   stripeSessionId : Stripe checkout session ID for card purchases.
 *                     sparse: true means the unique index only applies to documents
 *                     where this field exists (token purchases leave it null).
 *   paymentMethod   : "xp" for token purchases, "stripe" for card purchases
 *   currency        : "xp" for token purchases, "usd" for Stripe purchases
 *   timestamps      : createdAt = exact purchase time, updatedAt = last modified
 */
const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,       // Indexed for fast per-user purchase history queries
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopItem",
      required: true,
    },

    // Snapshot of the item name — preserved even if the ShopItem is renamed later
    itemName: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    // Remaining token balance after a token purchase (only relevant for xp purchases)
    xpAfterPurchase: {
      type: Number,
    },

    // Stripe session ID — used to match refunds/disputes and prevent duplicate grants.
    // sparse: true means only non-null values are included in the unique index,
    // allowing multiple token-purchase records (which have no session ID) to coexist.
    stripeSessionId: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
    },

    paymentMethod: {
      type: String,
      enum: ["xp", "stripe"],
      default: "xp",
    },

    currency: {
      type: String,
      default: "xp",   // "xp" for token purchases, "usd" for Stripe purchases
    },
  },
  { timestamps: true }
);

// Compound index for efficiently fetching a user's purchase history sorted by date
purchaseSchema.index({ userId: 1, createdAt: -1 });

// Use existing model if already compiled (prevents OverwriteModelError in hot-reload)
const Purchase =
  mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);

export default Purchase;
