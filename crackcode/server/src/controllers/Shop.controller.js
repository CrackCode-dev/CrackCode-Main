



// import Stripe from "stripe";

// const getStripe = () => {
//   if (!process.env.STRIPE_SECRET_KEY) {
//     throw new Error("STRIPE_SECRET_KEY is not configured");
//   }

//   return new Stripe(process.env.STRIPE_SECRET_KEY);
// };

// import {
//   purchaseItemWithXP,
//   getShopItems,
//   getMyInventory,
//   createCheckoutSession,
//   finalizePaidPurchase,
// } from "../modules/shop/Shop.service.js";


// /**
//  * Helper: consistently extract userId from req.user
//  */
// const getUserId = (req) => req.user?._id || req.user?.id;

// /**
//  * POST /api/shop/purchase
//  * Body: { itemId }
//  * Requires auth
//  */
// export const purchaseItem = async (req, res) => {
//   try {
//     // Debug (uncomment when testing auth middleware)
//     // console.log("AUTH HEADER:", req.headers.authorization);
//     // console.log("REQ.USER:", req.user);

//     const userId = getUserId(req);
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const { itemId } = req.body || {};
//     if (!itemId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "itemId is required" });
//     }

//     const result = await purchaseItemWithXP(userId, itemId);
//     return res.status(200).json(result);
//   } catch (error) {
//     console.error("Purchase error:", error);

//     // Map common business errors to more appropriate statuses
//     const msg = error?.message || "Purchase failed";

//     if (/not found|inactive/i.test(msg)) {
//       return res.status(404).json({ success: false, message: msg });
//     }
//     if (/unauthorized/i.test(msg)) {
//       return res.status(401).json({ success: false, message: msg });
//     }
//     if (/not enough|insufficient/i.test(msg)) {
//       return res.status(400).json({ success: false, message: msg });
//     }

//     return res.status(400).json({ success: false, message: msg });
//   }
// };

// /**
//  * GET /api/shop/items?category=avatar|theme|title|all
//  * Requires auth (keep if your app needs auth to see shop, otherwise remove middleware in routes)
//  */
// export const listItems = async (req, res) => {
//   try {
//     const { category } = req.query || {};
//     const items = await getShopItems(category);
//     return res.status(200).json({ success: true, items });
//   } catch (error) {
//     console.error("List items error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error?.message || "Failed to fetch items",
//     });
//   }
// };

// /**
//  * GET /api/shop/inventory?category=avatar|theme|title|all
//  * Requires auth
//  */
// export const myInventory = async (req, res) => {
//   try {
//     const userId = getUserId(req);
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const { category } = req.query || {};
//     const items = await getMyInventory(userId, category);

//     return res.status(200).json({ success: true, items });
//   } catch (error) {
//     console.error("Inventory error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error?.message || "Failed to fetch inventory",
//     });
//   }
// };



// //-------------------------------Controller for payment gateway------------------------------------------------ 




// export const createCheckoutSessionController = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { itemId } = req.body;

//     if (!itemId) {
//       return res.status(400).json({ message: "itemId is required" });
//     }

//     const session = await createCheckoutSession(userId, itemId);

//     res.json(session);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// export const stripeWebhookController = async (req, res) => {
//   const signature = req.headers["stripe-signature"];

//   let event;

//   try {
//     const stripe = getStripe();

//     event = stripe.webhooks.constructEvent(
//       req.body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error("Webhook signature verification failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   try {
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;

//       const userId = session.metadata?.userId;
//       const itemId = session.metadata?.itemId;
//       const stripeSessionId = session.id;

//       if (!userId || !itemId) {
//         return res.status(400).json({
//           success: false,
//           message: "Missing userId or itemId in Stripe metadata",
//         });
//       }

//       await finalizePaidPurchase({
//         userId,
//         itemId,
//         stripeSessionId,
//       });
//     }

//     return res.status(200).json({ received: true });
//   } catch (err) {
//     console.error("Stripe webhook processing failed:", err);
//     return res.status(500).json({
//       success: false,
//       message: err.message || "Webhook processing failed",
//     });
//   }
// };

import Stripe from "stripe";

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

import {
  purchaseItemWithTokens,
  getShopItems,
  getMyInventory,
  createCheckoutSession,
  finalizePaidPurchase,
} from "../modules/shop/Shop.service.js";

const getUserId = (req) => req.user?._id || req.user?.id;

/**
 * POST /api/shop/purchase
 */
export const purchaseItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { itemId } = req.body || {};
    if (!itemId) {
      return res
        .status(400)
        .json({ success: false, message: "itemId is required" });
    }

    const result = await purchaseItemWithTokens(userId, itemId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Purchase error:", error);

    const msg = error?.message || "Purchase failed";

    if (/not found|inactive/i.test(msg)) {
      return res.status(404).json({ success: false, message: msg });
    }
    if (/unauthorized/i.test(msg)) {
      return res.status(401).json({ success: false, message: msg });
    }
    if (/not enough|insufficient/i.test(msg)) {
      return res.status(400).json({ success: false, message: msg });
    }

    return res.status(400).json({ success: false, message: msg });
  }
};

/**
 * GET /api/shop/items
 */
export const listItems = async (req, res) => {
  try {
    const { category } = req.query || {};
    const items = await getShopItems(category);
    return res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("List items error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to fetch items",
    });
  }
};

/**
 * GET /api/shop/inventory
 */
export const myInventory = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { category } = req.query || {};
    const items = await getMyInventory(userId, category);

    return res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("Inventory error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to fetch inventory",
    });
  }
};

/**
 * POST /api/shop/checkout
 */
export const createCheckoutSessionController = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { itemId } = req.body || {};
    if (!itemId) {
      return res.status(400).json({ message: "itemId is required" });
    }

    const session = await createCheckoutSession(userId, itemId);

    return res.status(200).json(session);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * POST /api/shop/webhook
 */
export const stripeWebhookController = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    const stripe = getStripe();

    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const userId = session.metadata?.userId;
      const itemId = session.metadata?.itemId;
      const stripeSessionId = session.id;

      if (!userId || !itemId) {
        return res.status(400).json({
          success: false,
          message: "Missing userId or itemId in Stripe metadata",
        });
      }

      await finalizePaidPurchase({
        userId,
        itemId,
        stripeSessionId,
      });
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Stripe webhook processing failed:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Webhook processing failed",
    });
  }
};