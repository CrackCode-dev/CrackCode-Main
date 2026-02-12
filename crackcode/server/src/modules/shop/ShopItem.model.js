import mongoose from "mongoose";

const shopItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: ["avatar", "theme", "boost", "badge", "other"],
      default: "other",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    // Optional: item data (e.g. avatar URL, theme CSS, boost multiplier)
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ShopItem", shopItemSchema);