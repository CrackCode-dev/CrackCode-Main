// import mongoose from "mongoose";

// import ShopItem from "./ShopItem.model.js";
// import Inventory from "./Inventory.model.js";
// import Purchase from "./Purchase.model.js";
// import User from "../modules/auth/User.model.js";




// /**
//  * Buy a shop item using XP
//  * - checks item exists + active
//  * - checks user exists + enough XP
//  * - deducts XP
//  * - adds to inventory (or increases quantity)
//  * - writes purchase history
//  * Uses a MongoDB transaction so it's all-or-nothing.
//  */

// export const purchaseItemWithXP = async (userId, itemId) => {
//   const session = await mongoose.startSession();

//   try {
//     let result = null;

//     await session.withTransaction(async () => {
//       // Getting items
//       const item = await ShopItem.findById(itemId).session(session);
//       if (!item || !item.isActive) {
//         throw new Error("Item not found or inactive");
//       }

//       // Only allow XP items (and free) for now
//       if (!item.pricing || !["free", "xp"].includes(item.pricing.type)) {
//         throw new Error("This item is not available for XP purchase");
//       }

//       const priceXP = item.pricing.type === "free" ? 0 : item.pricing.amount;

//       // 2) Deduct XP atomically
//       // This ensures XP can't go negative even with concurrent purchases.
//       const user = await User.findOneAndUpdate(
//         { _id: userId, xp: { $gte: priceXP } },
//         { $inc: { xp: -priceXP } },
//         { new: true, session }
//       );

//       if (!user) {
//         throw new Error("Not enough XP or user not found");
//       }

//       // 3) Add to inventory (or increase quantity)
//       const updatedInventory = await Inventory.findOneAndUpdate(
//         { userId, itemId },
//         {
//           $setOnInsert: { category: item.category },
//           $inc: { quantity: 1 },
//         },
//         { upsert: true, new: true, session }
//       );

//       // 4) Save purchase history (snapshot)
//       await Purchase.create(
//         [
//           {
//             userId,
//             itemId,
//             itemName: item.name,
//             price: priceXP,
//             tokensAfterPurchase: user.xp, // your field name, but it's XP now
//           },
//         ],
//         { session }
//       );

//       result = {
//         success: true,
//         remainingXP: user.xp,
//         inventoryItem: updatedInventory,
//       };
//     });

//     return result;
//   } finally {
//     session.endSession();
//   }
// };



// //connecting API endpoints fot the help of UI

// export const getShopItems = async (category) => {
//   const filter = { isActive: true };
//   if (category && category !== "all") filter.category = category;

//   const items = await ShopItem.find(filter).sort({ createdAt: -1 });
//   return items;
// };


// // Get logged in user's inventory (for Inventory section)

// export const getMyInventory = async (userId, category) => {
//     const filter = { userId };
//     if (category && category !== "all") filter.category = category;
  
//     const inventory = await Inventory.find(filter)
//       .populate("itemId") // bring ShopItem details (name, imageUrl, pricing...)
//       .sort({ createdAt: -1 });
  
//     return inventory;
//   };




// --------------------- new updated code to centralize XP and users ---------------------------------------

// import mongoose from "mongoose";

// import ShopItem from "./ShopItem.model.js";
// import Inventory from "./Inventory.model.js";
// import Purchase from "./Purchase.model.js";
// import Stripe from "stripe";

// // Central XP/tokens spending service (single source of truth)
// import { spendTokens } from "../session/transaction.service.js";



// /**
//  * Buy a shop item using XP (or free)
//  * - checks item exists + active
//  * - checks pricing type is free/xp
//  * - deducts XP via transaction.service (atomic)
//  * - adds to inventory (or increases quantity)
//  * - writes purchase history
//  * Uses a MongoDB transaction so it's all-or-nothing.
//  */

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

//       // Only allow XP items (and free) for now
//       if (!item.pricing || !["free", "xp"].includes(item.pricing.type)) {
//         throw new Error("This item is not available for XP purchase");
//       }

//       const priceXP =
//         item.pricing.type === "free" ? 0 : Number(item.pricing.amount || 0);

//       if (priceXP < 0) throw new Error("Invalid item price");

//       // 2) Deduct XP atomically via transaction service
//       // IMPORTANT: spendTokens should throw if insufficient balance / user not found.
//       // Pass the mongoose session so it participates in the same DB transaction.
//       const spendResult = await spendTokens({
//         userId,
//         amount: priceXP,
//         reason: `shop_purchase:${String(item._id)}`,
//         session,
//       });

//       // Normalize remaining XP from whatever your service returns
//       // (support different return shapes safely)
      
//       const remainingXP =
//         spendResult?.remainingXP ??
//         spendResult?.xp ??
//         spendResult?.balance ??
//         spendResult?.user?.xp;

//       // If price is 0 (free item), remainingXP might be undefined depending on your spendTokens.
//       // That’s okay; we’ll still complete purchase.
//       // If you want it always, update spendTokens to always return updated balance.

//       // 3) Add to inventory (or increase quantity)
//       // Flat inventory document style: one doc per (userId, itemId)
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

//       // 4) Save purchase history (snapshot)
//       await Purchase.create(
//         [
//           {
//             userId,
//             itemId,
//             itemName: item.name,
//             price: priceXP,
//             tokensAfterPurchase: remainingXP, // keep your existing field name
//           },
//         ],
//         { session }
//       );

//       result = {
//         success: true,
//         remainingXP: remainingXP, // may be undefined for free items if spendTokens doesn't return it
//         inventoryItem: updatedInventory,
//       };
//     });

//     return result;
//   } catch (err) {
//     // Ensure consistent error message back to controller
//     throw err;
//   } finally {
//     session.endSession();
//   }
// };

// // ------------------------------------------------------------
// // API helpers for UI
// // ------------------------------------------------------------

// export const getShopItems = async (category) => {
//   const filter = { isActive: true };
//   if (category && category !== "all") filter.category = category;

//   const items = await ShopItem.find(filter).sort({ createdAt: -1 });
//   return items;
// };

// export const getMyInventory = async (userId, category) => {
//   const filter = { userId };
//   if (category && category !== "all") filter.category = category;

//   const inventory = await Inventory.find(filter)
//     .populate("itemId") // bring ShopItem details
//     .sort({ createdAt: -1 });

//   return inventory;
// };



// //-----------------------------Payment Gateway using stripe service -------------------------------------------------



// const getStripe = () => {
//   const secretKey = process.env.STRIPE_SECRET_KEY;

//   if (!secretKey) {
//     throw new Error("STRIPE_SECRET_KEY is not configured");
//   }

//   return new Stripe(secretKey);
// };

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

//   const session = await stripe.checkout.sessions.create({
//     mode: "payment",
//     payment_method_types: ["card"],
//     client_reference_id: String(userId),
//     metadata: {
//       userId: String(userId),
//       itemId: String(item._id),
//     },
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: item.name,
//             description: item.description || undefined,
//             images: item.imageUrl ? [item.imageUrl] : [],
//           },
//           unit_amount: Math.round(amount * 100), // USD -> cents
//         },
//         quantity: 1,
//       },
//     ],
//     success_url: `${process.env.CLIENT_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${process.env.CLIENT_URL}/shop/cancel`,
//   });

//   return {
//     success: true,
//     checkoutUrl: session.url,
//     sessionId: session.id,
//   };
// };



// -------------------------------- 2026-03-08 new version ---------------------------------------


import mongoose from "mongoose";
import Stripe from "stripe";

import ShopItem from "./ShopItem.model.js";
import Inventory from "./Inventory.model.js";
import Purchase from "./Purchase.model.js";
import { spendTokens } from "../session/transaction.service.js";

// ------------------------------------------------------------
// Stripe helper
// ------------------------------------------------------------
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return new Stripe(secretKey);
};

// ------------------------------------------------------------
// Buy item with XP / Free
// ------------------------------------------------------------
export const purchaseItemWithXP = async (userId, itemId) => {
  const session = await mongoose.startSession();

  try {
    let result = null;

    await session.withTransaction(async () => {
      // 1) Validate item
      const item = await ShopItem.findById(itemId).session(session);

      if (!item || !item.isActive) {
        throw new Error("Item not found or inactive");
      }

      // Only free / xp items can be bought here
      if (!item.pricing || !["free", "xp"].includes(item.pricing.type)) {
        throw new Error("This item is not available for XP purchase");
      }

      const priceXP =
        item.pricing.type === "free" ? 0 : Number(item.pricing.amount || 0);

      if (!Number.isFinite(priceXP) || priceXP < 0) {
        throw new Error("Invalid item price");
      }

      // 2) Spend XP atomically
      const spendResult = await spendTokens({
        userId,
        amount: priceXP,
        reason: `shop_purchase:${String(item._id)}`,
        session,
      });

      const remainingXP =
        spendResult?.remainingXP ??
        spendResult?.xp ??
        spendResult?.balance ??
        spendResult?.user?.xp;

      // 3) Add item to inventory
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

      // 4) Save purchase history
      await Purchase.create(
        [
          {
            userId,
            itemId,
            itemName: item.name,
            price: priceXP,
            tokensAfterPurchase: remainingXP ?? null,
          },
        ],
        { session }
      );

      result = {
        success: true,
        remainingXP: remainingXP ?? null,
        inventoryItem: updatedInventory,
      };
    });

    return result;
  } catch (err) {
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

  const imageUrl = item.imageUrl
    ? item.imageUrl.startsWith("http")
      ? item.imageUrl
      : `http://localhost:5050${item.imageUrl}`
    : null;

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
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};