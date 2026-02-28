import express from "express";
import authMiddleware from "../modules/auth/middleware.js";

import { purchaseItem, listItems, myInventory } from "../controllers/Shop.controller.js";

const router = express.Router();

// Public: view store items
router.get("/items", listItems);

// Protected: buy item
router.post("/purchase", authMiddleware, purchaseItem);

// Protected: get user's inventory
router.get("/inventory", authMiddleware, myInventory);

export default router;