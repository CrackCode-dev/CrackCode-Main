// ShopItem.model.js — defines the MongoDB schema for items available in the store.
// Each document represents one purchasable item (avatar, theme, etc.)
// Items are seeded via seeds/seedShopItems.js and managed by Shop.service.js.

import mongoose from "mongoose";

/**
 * pricingSchema — embedded sub-document for an item's price.
 *
 * type     : "free"  → no cost, just claim it
 *            "xp"   → paid with in-app tokens (earned by playing)
 *            "paid" → paid with real money via Stripe (amount is in USD)
 * amount   : numeric value (0 for free, token count for xp, dollars for paid)
 * currency : auto-set by the pre-validate hook — "XP" for free/xp, "USD" for paid
 *
 * { _id: false } prevents Mongoose from creating a separate _id for this sub-document.
 */
const pricingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["free", "xp", "paid"],
      required: true,
    },

    amount: {
      type: Number,
      min: 0,
      default: 0,
    },

    currency: {
      type: String,
      enum: ["USD", "XP"],
      default: "USD",
    },
  },
  { _id: false } // No separate _id for the nested pricing object
);

/**
 * shopItemSchema — main schema for a store item.
 *
 * Fields:
 *   name       : display name shown in the store
 *   description: optional subtitle / flavour text
 *   category   : determines equip slot and how it's applied
 *                "avatar"  → replaces the user's profile picture
 *                "theme"   → changes the app colour scheme (themeKey in metadata)
 *                others    → boost, badge, bundle, other (future use)
 *   pricing    : embedded pricingSchema (required)
 *   imageUrl   : path to the item's preview image (served from /public/shop/ or uploads/)
 *   metadata   : flexible Mixed field for extra data
 *                e.g. { themeKey: "midnight" } for themes,
 *                     { rarity: "premium" } for paid avatars
 *   isActive   : soft-delete flag — inactive items are hidden from the store
 *   timestamps : createdAt and updatedAt added automatically by Mongoose
 */
const shopItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: ["avatar", "theme", "boost", "badge", "bundle", "other"],
      default: "other",
    },

    pricing: {
      type: pricingSchema,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    // Mixed type allows any shape — used for themeKey, rarity, badgeType, etc.
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Set to false to hide an item from the store without deleting it
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/**
 * Pre-validate hook — enforces pricing business rules before saving.
 *
 * Rules:
 *   - "free"  items: force amount = 0 and currency = "XP"
 *   - "xp"   items: force currency = "XP"
 *   - "paid" items: force currency = "USD"
 *   - Any non-free item must have amount > 0
 */
shopItemSchema.pre("validate", function (next) {
  if (!this.pricing) return next(new Error("Price is required"));

  // Free items must always have amount 0
  if (this.pricing.type === "free") {
    this.pricing.amount = 0;
    this.pricing.currency = "XP";
  }

  // Token-based items use XP currency
  if (this.pricing.type === "xp") {
    this.pricing.currency = "XP";
  }

  // Real-money items use USD
  if (this.pricing.type === "paid") {
    this.pricing.currency = "USD";
  }

  // Reject xp/paid items with a zero or missing amount
  if (
    this.pricing.type !== "free" &&
    (!this.pricing.amount || this.pricing.amount <= 0)
  ) {
    return next(
      new Error("Amount must be greater than 0 for xp or paid items")
    );
  }

  next();
});

// Compound index for fast store queries filtered by category and active status
shopItemSchema.index({ category: 1, isActive: 1 });

// Use existing model if already compiled (prevents OverwriteModelError in hot-reload)
const shopItem = mongoose.models.ShopItem || mongoose.model("ShopItem", shopItemSchema);
export default shopItem;
