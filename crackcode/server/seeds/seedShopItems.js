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

      {
        name: "Pro Avatar Pack",
        description: "Premium avatar pack for CrackCode users.",
        category: "avatar",
        pricing: {
          type: "paid",
          amount: 4.99,
          currency: "USD",
        },
        imageUrl: "https://example.com/pro-avatar-pack.png",
        metadata: {
          rarity: "premium",
        },
        isActive: true,
      },
      {
        name: "Dark Neon Theme",
        description: "Premium neon theme for your CrackCode profile.",
        category: "theme",
        pricing: {
          type: "paid",
          amount: 2.99,
          currency: "USD",
        },
        imageUrl: "https://example.com/dark-neon-theme.png",
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