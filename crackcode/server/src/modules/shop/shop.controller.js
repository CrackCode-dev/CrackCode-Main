import ShopItem from "./ShopItem.model.js";
import Purchase from "./Purchase.model.js";
import { spendTokens } from "../session/transaction.service.js";

/**
 * GET /api/shop/items
 * List all active shop items. Optional ?category= filter.
 */
export const getShopItems = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;

    const items = await ShopItem.find(filter).sort({ price: 1 });
    return res.json({ success: true, items });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/shop/purchase
 * Body: { itemId: String }
 * Atomically deducts tokens and records the purchase.
 */
export const purchaseItem = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res
        .status(400)
        .json({ success: false, message: "itemId is required" });
    }

    const item = await ShopItem.findById(itemId);
    if (!item || !item.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    // Atomic spend (throws if insufficient balance)
    const result = await spendTokens(
      req.userId,
      item.price,
      item._id,
      item.name
    );

    // Record purchase
    await Purchase.create({
      userId: req.userId,
      itemId: item._id,
      itemName: item.name,
      price: item.price,
      tokensAfterPurchase: result.tokens,
    });

    return res.json({
      success: true,
      message: `Purchased ${item.name}`,
      tokens: result.tokens,
      item: {
        id: item._id,
        name: item.name,
        category: item.category,
      },
    });
  } catch (error) {
    console.error("Purchase error:", error);
    const status = error.message.includes("Insufficient") ? 400 : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/shop/purchases
 * Returns the authenticated user's purchase history.
 */
export const getUserPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({ success: true, purchases });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/shop/items  (admin — add a shop item)
 * Body: { name, description, category, price, imageUrl, metadata }
 */
export const createShopItem = async (req, res) => {
  try {
    const item = await ShopItem.create(req.body);
    return res.status(201).json({ success: true, item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};