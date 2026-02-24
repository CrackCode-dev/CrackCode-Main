import mongoose from "mongoose";

/**
 * Pricing Sub-Schema
 * Handles free, xp-based, and paid items
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
  { _id: false } // Prevents creating separate _id for pricing object
);

/**
 * Main Shop Item Schema
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

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/** 2026/02/22 
 * Validation:
 * Ensure xp and paid items have amount > 0
 */

shopItemSchema.pre("validate", function (next) {
  if (this.pricing.type === "free") {
    this.pricing.amount = 0;
  }

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


/**
 * Indexes for performance
 */
shopItemSchema.index({ category: 1, isActive: 1 });



const shopItem = mongoose.models.ShopItem ||  mongoose.model("ShopItem", shopItemSchema);
export default shopItem;