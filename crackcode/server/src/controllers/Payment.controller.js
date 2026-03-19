// import Stripe from "stripe";
// import Inventory from "../modules/shop/Inventory.model.js";
// import Purchase from "../modules/shop/Purchase.model.js";
// import ShopItem from "../modules/shop/ShopItem.model.js";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const stripeWebhook = async (req, res) => {
//   const sig = req.headers["stripe-signature"];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error("Webhook signature verification failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;

//     const userId = session.metadata?.userId;
//     const itemId = session.metadata?.itemId;

//     try {
//       const item = await ShopItem.findById(itemId);

//       if (!item) {
//         throw new Error("Item not found");
//       }

//       await Inventory.findOneAndUpdate(
//         { userId, itemId },
//         {
//           $setOnInsert: {
//             userId,
//             itemId,
//             category: item.category,
//           },
//           $inc: { quantity: 1 },
//         },
//         { upsert: true, new: true }
//       );

//       await Purchase.create({
//         userId,
//         itemId,
//         itemName: item.name,
//         price: item.pricing.amount,
//         tokensAfterPurchase: null,
//       });

//       console.log("Paid item granted successfully");
//     } catch (error) {
//       console.error("Webhook processing error:", error.message);
//       return res.status(500).json({ message: "Webhook processing failed" });
//     }
//   }

//   return res.json({ received: true });
// };


// const getStripe = () => {
//     const secretKey = process.env.STRIPE_SECRET_KEY;
  
//     if (!secretKey) {
//       throw new Error("STRIPE_SECRET_KEY is missing");
//     }
  
//     return new Stripe(secretKey);
//   };
  
//   export const stripeWebhook = async (req, res) => {
//     let stripe;
  
//     try {
//       stripe = getStripe();
//     } catch (err) {
//       return res.status(500).json({ message: err.message });
//     }
  
//     const sig = req.headers["stripe-signature"];
  
//     let event;
  
//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       console.error("Webhook signature verification failed:", err.message);
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }
  
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
  
//       const userId = session.metadata?.userId;
//       const itemId = session.metadata?.itemId;
  
//       try {
//         const item = await ShopItem.findById(itemId);
  
//         if (!item) {
//           throw new Error("Item not found");
//         }
  
//         await Inventory.findOneAndUpdate(
//           { userId, itemId },
//           {
//             $setOnInsert: {
//               userId,
//               itemId,
//               category: item.category,
//             },
//             $inc: { quantity: 1 },
//           },
//           { upsert: true, new: true }
//         );
  
//         await Purchase.create({
//           userId,
//           itemId,
//           itemName: item.name,
//           price: item.pricing.amount,
//           tokensAfterPurchase: null,
//         });
  
//         console.log("Paid item granted successfully");
//       } catch (error) {
//         console.error("Webhook processing error:", error.message);
//         return res.status(500).json({ message: "Webhook processing failed" });
//       }
//     }
  
//     return res.json({ received: true });
//   };

//----------------------------------------------

// import Stripe from "stripe";

// // other imports...

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // existing controllers...
// export const verifyStripeSession = async (req, res) => {
//   try {
//     const { session_id } = req.query;

//     if (!session_id) {
//       return res.status(400).json({
//         success: false,
//         message: "session_id is required",
//       });
//     }

//     const session = await stripe.checkout.sessions.retrieve(session_id);

//     if (session.payment_status !== "paid") {
//       return res.status(400).json({
//         success: false,
//         message: "Payment not completed",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Payment verified successfully",
//     });
//   } catch (error) {
//     console.error("Verify Stripe session error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to verify payment session",
//     });
//   }
// };

// export const stripeWebhook = async (req, res) => {
//   try {
//     return res.status(200).json({ received: true });
//   } catch (error) {
//     console.error("Stripe webhook error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Webhook failed",
//     });
//   }
// };

import Stripe from "stripe";
import Inventory from "../modules/shop/Inventory.model.js";
import ShopItem from "../modules/shop/ShopItem.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const verifyStripeSession = async (req, res) => {
  try {
    const { session_id } = req.query;

    console.log("verify route hit");
    console.log("session_id:", session_id);

    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: "session_id is required",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    console.log("stripe session metadata:", session.metadata);
    console.log("stripe payment status:", session.payment_status);

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    const userId = session.metadata?.userId;
    const itemId = session.metadata?.itemId;

    console.log("userId:", userId);
    console.log("itemId:", itemId);

    if (!userId || !itemId) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or itemId in Stripe metadata",
      });
    }

    const existingInventoryItem = await Inventory.findOne({ userId, itemId });

    if (!existingInventoryItem) {
      const item = await ShopItem.findById(itemId);
      if (!item) {
        return res.status(404).json({ success: false, message: "Shop item not found" });
      }

      await Inventory.create({
        userId,
        itemId,
        category: item.category,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully and inventory updated",
    });
  } catch (error) {
    console.error("Verify Stripe session error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify payment session",
    });
  }
};

export const stripeWebhook = async (req, res) => {
  try {
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return res.status(500).json({
      success: false,
      message: "Webhook failed",
    });
  }
};