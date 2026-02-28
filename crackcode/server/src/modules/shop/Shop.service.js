import mongoose from "mongoose";

import ShopItem from "./ShopItem.model.js";
import Inventory from "./Inventory.model.js";
import Purchase from "./Purchase.model.js";




/**
 * Buy a shop item using XP
 * - checks item exists + active
 * - checks user exists + enough XP
 * - deducts XP
 * - adds to inventory (or increases quantity)
 * - writes purchase history
 * Uses a MongoDB transaction so it's all-or-nothing.
 */
export const purchaseItemWithXP = async (userId, itemId) => {
  const session = await mongoose.startSession();

  try {
    let result = null;

    await session.withTransaction(async () => {
      // Getting items
      const item = await ShopItem.findById(itemId).session(session);
      if (!item || !item.isActive) {
        throw new Error("Item not found or inactive");
      }

      // Only allow XP items (and free) for now
      if (!item.pricing || !["free", "xp"].includes(item.pricing.type)) {
        throw new Error("This item is not available for XP purchase");
      }

      const priceXP = item.pricing.type === "free" ? 0 : item.pricing.amount;

      // 2) Deduct XP atomically
      // This ensures XP can't go negative even with concurrent purchases.
      const user = await User.findOneAndUpdate(
        { _id: userId, xp: { $gte: priceXP } },
        { $inc: { xp: -priceXP } },
        { new: true, session }
      );

      if (!user) {
        throw new Error("Not enough XP or user not found");
      }

      // 3) Add to inventory (or increase quantity)
      const updatedInventory = await Inventory.findOneAndUpdate(
        { userId, itemId },
        {
          $setOnInsert: { category: item.category },
          $inc: { quantity: 1 },
        },
        { upsert: true, new: true, session }
      );

      // 4) Save purchase history (snapshot)
      await Purchase.create(
        [
          {
            userId,
            itemId,
            itemName: item.name,
            price: priceXP,
            tokensAfterPurchase: user.xp, // your field name, but it's XP now
          },
        ],
        { session }
      );

      result = {
        success: true,
        remainingXP: user.xp,
        inventoryItem: updatedInventory,
      };
    });

    return result;
  } finally {
    session.endSession();
  }
};



//connecting API endpoints fot the help of UI

export const getShopItems = async (category) => {
  const filter = { isActive: true };
  if (category && category !== "all") filter.category = category;

  const items = await ShopItem.find(filter).sort({ createdAt: -1 });
  return items;
};


// Get logged in user's inventory (for Inventory section)

export const getMyInventory = async (userId, category) => {
    const filter = { userId };
    if (category && category !== "all") filter.category = category;
  
    const inventory = await Inventory.find(filter)
      .populate("itemId") // bring ShopItem details (name, imageUrl, pricing...)
      .sort({ createdAt: -1 });
  
    return inventory;
  };