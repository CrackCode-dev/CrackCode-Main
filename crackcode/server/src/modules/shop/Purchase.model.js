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

    xpAfterPurchase: {
      type: Number,
    },

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
      default: "xp",
    },
  },
  { timestamps: true }
);

purchaseSchema.index({ userId: 1, createdAt: -1 });

const Purchase =
  mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);

export default Purchase;