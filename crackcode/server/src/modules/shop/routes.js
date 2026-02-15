import express from "express";
import userAuth from "../auth/middleware.js";
import {
  getShopItems,
  purchaseItem,
  getUserPurchases,
  createShopItem,
} from "./shop.controller.js";

const router = express.Router();

// Public
router.get("/items", getShopItems);

// Protected
router.post("/purchase", userAuth, purchaseItem);
router.get("/purchases", userAuth, getUserPurchases);

// Admin (TODO: add admin-role check middleware)
router.post("/items", userAuth, createShopItem);

// Health check
router.get("/test", (_req, res) =>
  res.json({ success: true, message: "Shop routes working" })
);

export default router;