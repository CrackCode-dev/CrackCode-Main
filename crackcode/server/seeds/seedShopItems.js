import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import ShopItem from "../src/modules/shop/ShopItem.model.js";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Mongo connected");

    const items = [
      {
        name: "Beginner Avatar",
        category: "avatar",
        isActive: true,
        imageUrl: "/uploads/avatars/default.png",
        pricing: { type: "free", amount: 0 },
      },

      {
        name: "Pro Avatar",
        category: "avatar",
        isActive: true,
        imageUrl: "/uploads/avatars/pro.png",
        pricing: { type: "xp", amount: 200 },
      },

      {
        name: "Cool Title",
        category: "title",
        isActive: true,
        pricing: { type: "xp", amount: 50 },
      },
      
    ];

    // avoid duplicates by name
    for (const item of items) {
      await ShopItem.updateOne(
        { name: item.name },
        { $set: item },
        { upsert: true }
      );
    }

    console.log("✅ Shop items updated");
    process.exit(0);
  } catch (e) {
    console.error("❌ Seed failed:", e.message);
    process.exit(1);
  }
};

run();