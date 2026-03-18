
// // -------------------------------- 2026-03-08 new version ---------------------------------------


// import mongoose from "mongoose";
// import Stripe from "stripe";

// import ShopItem from "./ShopItem.model.js";
// import Inventory from "./Inventory.model.js";
// import Purchase from "./Purchase.model.js";
// import { spendXp } from "../session/transaction.service.js";


// // ------------------------------------------------------------
// // Stripe helper
// // ------------------------------------------------------------
// const getStripe = () => {
//   const secretKey = process.env.STRIPE_SECRET_KEY;

//   if (!secretKey) {
//     throw new Error("STRIPE_SECRET_KEY is not configured");
//   }

//   return new Stripe(secretKey);
// };

// // ------------------------------------------------------------
// // Buy item with XP / Free
// // ------------------------------------------------------------
// export const purchaseItemWithXP = async (userId, itemId) => {
//   const session = await mongoose.startSession();

//   try {
//     let result = null;

//     await session.withTransaction(async () => {
//       // 1) Validate item
//       const item = await ShopItem.findById(itemId).session(session);

//       if (!item || !item.isActive) {
//         throw new Error("Item not found or inactive");
//       }

//       const existingInventory = await Inventory.findOne({ userId, itemId }).session(session);

//       if (existingInventory) {
//         throw new Error("You already own this item");
//       }
      

//       // Only free / xp items can be bought here
//       if (!item.pricing || !["free", "xp"].includes(item.pricing.type)) {
//         throw new Error("This item is not available for XP purchase");
//       }

//       const priceXP =
//         item.pricing.type === "free" ? 0 : Number(item.pricing.amount || 0);

//       if (!Number.isFinite(priceXP) || priceXP < 0) {
//         throw new Error("Invalid item price");
//       }

//       // 2) Spend XP atomically
//       const spendResult = await spendXp({
//         userId,
//         amount: priceXP,
//         reason: `shop_purchase:${String(item._id)}`,
//         session,
//       });

//       const remainingXP =
//         spendResult?.remainingXP ??
//         spendResult?.xp ??
//         spendResult?.balance ??
//         spendResult?.user?.xp;

//       // 3) Add item to inventory
//       const updatedInventory = await Inventory.findOneAndUpdate(
//         { userId, itemId },
//         {
//           $setOnInsert: {
//             userId,
//             itemId,
//             category: item.category,
//           },
//           $inc: { quantity: 1 },
//         },
//         { upsert: true, new: true, session }
//       );

//       // 4) Save purchase history
//       await Purchase.create(
//         [
//           {
//             userId,
//             itemId,
//             itemName: item.name,
//             price: priceXP,
//             xpAfterPurchase: remainingXP ?? null,
//           },
//         ],
//         { session }
//       );

//       result = {
//         success: true,
//         remainingXP: remainingXP ?? null,
//         inventoryItem: updatedInventory,
//       };
//     });

//     return result;
//   } catch (err) {
//     throw err;
//   } finally {
//     session.endSession();
//   }
// };

// // ------------------------------------------------------------
// // Get active shop items
// // ------------------------------------------------------------
// export const getShopItems = async (category) => {
//   const filter = { isActive: true };

//   if (category && category !== "all") {
//     filter.category = category;
//   }

//   const items = await ShopItem.find(filter).sort({ createdAt: -1 });
//   return items;
// };

// // ------------------------------------------------------------
// // Get logged-in user's inventory
// // ------------------------------------------------------------
// export const getMyInventory = async (userId, category) => {
//   const filter = { userId };

//   if (category && category !== "all") {
//     filter.category = category;
//   }

//   const inventory = await Inventory.find(filter)
//     .populate("itemId")
//     .sort({ createdAt: -1 });

//   return inventory;
// };

// // ------------------------------------------------------------
// // Create Stripe checkout session for paid items
// // ------------------------------------------------------------
// export const createCheckoutSession = async (userId, itemId) => {
//   const stripe = getStripe();

//   const item = await ShopItem.findById(itemId);

//   if (!item || !item.isActive) {
//     throw new Error("Item not found or inactive");
//   }

//   if (!item.pricing || item.pricing.type !== "paid") {
//     throw new Error("This item is not available for paid checkout");
//   }

//   const amount = Number(item.pricing.amount || 0);

//   if (!Number.isFinite(amount) || amount <= 0) {
//     throw new Error("Invalid paid item price");
//   }

//   const imageUrl = item.imageUrl
//     ? item.imageUrl.startsWith("http")
//       ? item.imageUrl
//       : `http://localhost:5050${item.imageUrl}`
//     : null;

//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       payment_method_types: ["card"],
//       client_reference_id: String(userId),
//       metadata: {
//         userId: String(userId),
//         itemId: String(item._id),
//       },
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: item.name,
//               description: item.description || undefined,
//             },
//             unit_amount: Math.round(amount * 100),
//           },
//           quantity: 1,
//         },
//       ],
//       success_url: `${process.env.CLIENT_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/shop/cancel`,
//     });
    
//   return {
//     success: true,
//     url: session.url,
//     sessionId: session.id,
//   };
  
// };

// // ------------------------------------------------------------
// // Finalize paid purchase after Stripe webhook success
// // ------------------------------------------------------------
// export const finalizePaidPurchase = async ({
//   userId,
//   itemId,
//   stripeSessionId,
// }) => {
//   const session = await mongoose.startSession();

//   try {
//     let result = null;

//     await session.withTransaction(async () => {
//       const item = await ShopItem.findById(itemId).session(session);

//       if (!item || !item.isActive) {
//         throw new Error("Item not found or inactive");
//       }

//       // Prevent duplicate processing if Stripe retries webhook
//       const existingPurchase = await Purchase.findOne({
//         stripeSessionId,
//       }).session(session);

//       if (existingPurchase) {
//         result = {
//           success: true,
//           alreadyProcessed: true,
//         };
//         return;
//       }

//       // Add item to inventory
//       const updatedInventory = await Inventory.findOneAndUpdate(
//         { userId, itemId },
//         {
//           $setOnInsert: {
//             userId,
//             itemId,
//             category: item.category,
//           },
//           $inc: { quantity: 1 },
//         },
//         {
//           upsert: true,
//           new: true,
//           session,
//         }
//       );

//       // Save purchase history
//       await Purchase.create(
//         [
//           {
//             userId,
//             itemId,
//             itemName: item.name,
//             price: Number(item.pricing?.amount || 0),
//             stripeSessionId,
//             paymentMethod: "stripe",
//             currency: "usd",
//           },
//         ],
//         { session }
//       );

//       result = {
//         success: true,
//         inventoryItem: updatedInventory,
//       };
//     });

//     return result;
//   } catch (err) {
//     throw err;
//   } finally {
//     session.endSession();
//   }
// };



import mongoose from "mongoose";
import Stripe from "stripe";

import ShopItem from "./ShopItem.model.js";
import Inventory from "./Inventory.model.js";
import Purchase from "./Purchase.model.js";
import User from "../auth/User.model.js"; // adjust path if needed

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

      const existingInventory = await Inventory.findOne({ userId, itemId }).session(session);

      if (existingInventory) {
        throw new Error("You already own this item");
      }

      if (!item.pricing || !["free", "tokens"].includes(item.pricing.type)) {
        throw new Error("This item is not available for token purchase");
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

      const updatedInventory = await Inventory.findOneAndUpdate(
        { userId, itemId },
        {
          $setOnInsert: {
            userId,
            itemId,
            category: item.category,
          },
          $inc: { quantity: 1 },
        },
        { upsert: true, new: true, session }
      );

      await Purchase.create(
        [
          {
            userId,
            itemId,
            itemName: item.name,
            price: priceTokens,
            tokensAfterPurchase: user.tokens,
            currency: "tokens",
          },
        ],
        { session }
      );

      result = {
        success: true,
        remainingTokens: user.tokens,
        inventoryItem: updatedInventory,
      };
    });

    return result;
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

  const items = await ShopItem.find(filter).sort({ createdAt: -1 });
  return items;
};

// ------------------------------------------------------------
// Get logged-in user's inventory
// ------------------------------------------------------------
export const getMyInventory = async (userId, category) => {
  const filter = { userId };

  if (category && category !== "all") {
    filter.category = category;
  }

  const inventory = await Inventory.find(filter)
    .populate("itemId")
    .sort({ createdAt: -1 });

  return inventory;
};

// ------------------------------------------------------------
// Create Stripe checkout session for paid items
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
    success_url: `${process.env.CLIENT_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/shop/cancel`,
  });

  return {
    success: true,
    url: session.url,
    sessionId: session.id,
  };
};

// ------------------------------------------------------------
// Finalize paid purchase after Stripe webhook success
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

      const existingPurchase = await Purchase.findOne({
        stripeSessionId,
      }).session(session);

      if (existingPurchase) {
        result = {
          success: true,
          alreadyProcessed: true,
        };
        return;
      }

      const updatedInventory = await Inventory.findOneAndUpdate(
        { userId, itemId },
        {
          $setOnInsert: {
            userId,
            itemId,
            category: item.category,
          },
          $inc: { quantity: 1 },
        },
        {
          upsert: true,
          new: true,
          session,
        }
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
        inventoryItem: updatedInventory,
      };
    });

    return result;
  } finally {
    session.endSession();
  }
};