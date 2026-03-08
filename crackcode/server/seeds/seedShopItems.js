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
        name: "Cena",
        category: "avatar",
        isActive: true,
        imageUrl: "uploads/avatars/Cena.png",
        pricing: { type: "free", amount: 0 },
      },

      {
        name: "Prime",
        category: "avatar",
        isActive: true,
        imageUrl: "/uploads/avatars/Prime.png",
        pricing: { type: "xp", amount: 200 },
      },

      {
        name: "Batman",
        description: "Premium avatar",
        category: "avatar",
        pricing: {
          type: "paid",
          amount: 4.99,
          currency: "USD",
        },
        imageUrl: "/upload/avatars/Batman.png",
        metadata: {
          rarity: "premium",
        },
        isActive: true,
      },
      {
        name: "Wizard",
        description: "Premium avatar",
        category: "avatar",
        pricing: {
          type: "paid",
          amount: 2.99,
          currency: "USD",
        },
        imageUrl: "/uploads/avatars/Wizard.png",
        metadata: {
          themeKey: "dark_neon",
        },
        isActive: true,
      },
      
      {
        name: "Legend Badge",
        description: "Exclusive paid badge for your profile.",
        category: "badge",
        pricing: {
          type: "paid",
          amount: 1.99,
          currency: "USD",
        },
        imageUrl: "https://example.com/legend-badge.png",
        metadata: {
          badgeType: "legend",
        },
        isActive: true,
      }
      
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