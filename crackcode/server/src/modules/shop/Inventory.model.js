//preventing user buying same item that purchased. for that we should make the user as a saved user 

import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(

  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //  User model name is "User"
      required: true,
      index: true,
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopItem",
      required: true,
      index: true,
    },

    // For consumables ( bundles and all)
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },


    // For equipable items (avatars,themes and badges)

    equipped: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
);

/** 
 * Prevent duplicates:
 * One user can only have ONE inventory record per item.
 * If they buy again, you update quantity instead of creating a new row.
 */

inventorySchema.index({ userId: 1, itemId: 1 }, { unique: true });

export default mongoose.models.Inventory ||
  mongoose.model("Inventory", inventorySchema);