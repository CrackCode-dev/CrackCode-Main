// Inventory.model.js — tracks which shop items each user owns.
//
// One Inventory document = one user owning one item.
// The compound unique index on (userId, itemId) prevents a user from
// buying the same item twice — the database will reject duplicate inserts.

import mongoose from "mongoose";

/**
 * inventorySchema — represents a single owned item in a user's inventory.
 *
 * Fields:
 *   userId   : reference to the User who owns this item (indexed for fast lookups)
 *   itemId   : reference to the ShopItem that was purchased (indexed for fast lookups)
 *   category : copied from the ShopItem at purchase time so inventory queries
 *              can filter by category without joining ShopItem every time
 *   quantity : how many of this item the user has (relevant for consumables like bundles)
 *              always 1 for non-consumable items (avatars, themes)
 *   timestamps: createdAt = purchase date, updatedAt = last modified
 *
 * Note: the `equipped` field is intentionally commented out.
 * Equipped state is stored on the User model (equippedAvatarItemId) instead,
 * so a single field can be checked without scanning the entire inventory.
 */
const inventorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",       // References the User model
      required: true,
      index: true,       // Indexed for fast per-user inventory queries
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopItem",   // References the ShopItem model
      required: true,
      index: true,
    },

    category: {
      type: String,
      enum: ["avatar", "theme", "title", "boost", "badge", "bundle", "other"],
      required: true,
    },

    // Quantity is relevant for consumable items (e.g. bundles).
    // For non-consumables (avatars, themes) this is always 1.
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Equipped state is tracked on the User document instead of here,
    // so it can be read without querying the whole inventory collection.
    // equipped: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { timestamps: true }
);

/**
 * Unique compound index on (userId, itemId).
 * Ensures one user can only have one inventory record per item.
 * Any attempt to insert a duplicate will throw a MongoDB error with code 11000,
 * which Shop.service.js catches and converts to "You already own this item".
 */
inventorySchema.index({ userId: 1, itemId: 1 }, { unique: true });

// Use existing model if already compiled (prevents OverwriteModelError in hot-reload)
const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);

export default Inventory;
