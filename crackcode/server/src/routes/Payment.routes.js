
// import express from "express";
// import {
//   stripeWebhook,
//   verifyStripeSession,
// } from "../controllers/Payment.controller.js";

// const router = express.Router();

// // ✅ ADD THIS (CRITICAL)
// router.get("/verify-session", verifyStripeSession);

// // Stripe webhook endpoint
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   stripeWebhook
// );

// export default router;


import express from "express";
import {
  stripeWebhook,
  verifyStripeSession,
} from "../controllers/Payment.controller.js";

const router = express.Router();

router.get("/verify-session", verifyStripeSession);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;