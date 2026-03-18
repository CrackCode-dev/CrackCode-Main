// //This file is for the users to view payment histories, get receipts...


// import mongoose from "mongoose";

// const purchaseSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },

//     itemId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ShopItem",
//       required: true,
//     },

//     itemName: {
//       type: String,
//       required: true,
//     },

//     price: {
//       type: Number,
//       required: true,
//     },

//     tokensAfterPurchase: {
//       type: Number,
//       required: true,
//     },
    
//   },
//   { timestamps: true }
// );

// // Index for "get user's purchases"

// purchaseSchema.index({ userId: 1, createdAt: -1 });

// const Purchase = mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);

// export default Purchase;



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

    // XP balance after purchase (for XP purchases only)
    xpAfterPurchase: {
      type: Number,
    },

    // Stripe session ID (for paid purchases)
    stripeSessionId: {
      type: String,
      index: true,
    },

    // Payment method used
    paymentMethod: {
      type: String,
      enum: ["xp", "stripe"],
      default: "xp",
    },

    // Currency for paid purchases
    currency: {
      type: String,
      default: "xp",
    },
  },
  { timestamps: true }
);

// Index for "get user's purchases"
purchaseSchema.index({ userId: 1, createdAt: -1 });

const Purchase =
  mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);

export default Purchase;