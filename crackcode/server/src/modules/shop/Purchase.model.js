//This file is for the users to view payment histories, get receipts...


import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopItem",
      required: true,
    },

    itemName: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    tokensAfterPurchase: {
      type: Number,
      required: true,
    },
    
  },
  { timestamps: true }
);

// Index for "get user's purchases"

purchaseSchema.index({ userId: 1, createdAt: -1 });

const Purchase = mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);

export default Purchase;