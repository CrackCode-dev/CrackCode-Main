import { purchaseItemWithXP, getShopItems, getMyInventory } from "../modules/shop/Shop.service.js";
/**
 * POST /api/shop/purchase
 * Body: { itemId }
 */
export const purchaseItem = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ success: false, message: "itemId is required" });
    }

    const result = await purchaseItemWithXP(userId, itemId);
    return res.json(result);
  } catch (error) {
    console.error("Purchase error:", error);
    return res.status(400).json({ success: false, message: error.message || "Purchase failed" });
  }
};

/**
 * GET /api/shop/items?category=avatar|theme|title|all
 */
export const listItems = async (req, res) => {
  try {
    const { category } = req.query;
    const items = await getShopItems(category);

    return res.json({ success: true, items });
  } catch (error) {
    console.error("List items error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch items" });
  }
};

/**
 * GET /api/shop/inventory?category=avatar|theme|title|all
 * Requires auth
 */
export const myInventory = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { category } = req.query;
    const items = await getMyInventory(userId, category);

    return res.json({ success: true, items });
  } catch (error) {
    console.error("Inventory error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch inventory" });
  }
};