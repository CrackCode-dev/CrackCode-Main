/**
 * seedShopItems.js — populates the database with the default shop catalogue.
 *
 * Run this script manually whenever you need to add or update shop items:
 *   node seeds/seedShopItems.js
 *
 * It uses upsert (insert or update) so it is safe to run multiple times 
 * existing items are updated in place rather than duplicated.
 *
 * Pricing types:
 *   "xp"   — purchased with in-app tokens (free real-money cost)
 *   "paid" — purchased via Stripe (real money, amount is in USD)
 *   "free" — claimable at no cost
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// Resolve __dirname for ES module files (not available natively in ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the server's .env file (contains MONGODB_URI)
dotenv.config({ path: path.join(__dirname, "../.env") });

import ShopItem from "../src/modules/shop/ShopItem.model.js";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Mongo connected");

    // --- Shop item definitions ---
    // Each object maps directly to the ShopItem schema.
    // imageUrl paths are relative to the client /public folder (served by Vite).
    // metadata carries extra data used at runtime (e.g. themeKey to apply a theme, rarity label).
    const items = [

      // ── Themes ─────────────────────────────────────────────────────────────
      // themeKey in metadata must match a key in the client's ThemeContext
      // so the theme is applied immediately when the user equips it.
      {
        name: "Country Theme",
        description: "A warm rustic country-style theme for your profile.",
        category: "theme",
        pricing: { type: "paid", amount: 6.00, currency: "USD" },
        imageUrl: "/shop/country.png",
        metadata: { themeKey: "country" },
        isActive: true,
      },

      {
        name: "Midnight Theme",
        description: "A calm midnight blue theme for your profile.",
        category: "theme",
        pricing: { type: "paid", amount: 6.00, currency: "USD" },
        imageUrl: "/shop/midnight.png",
        metadata: { themeKey: "midnight" },
        isActive: true,
      },

      // ── Token-based avatars (bought with in-app tokens / "xp") ──────────────
      // These are free-to-earn avatars that players unlock by spending tokens.
      {
        name: "Cena",
        category: "avatar",
        isActive: true,
        imageUrl: "/shop/cena.png",
        pricing: { type: "xp", amount: 50 },
      },

      {
        name: "Goblin",
        category: "avatar",
        isActive: true,
        imageUrl: "/shop/goblin.jpg",
        pricing: { type: "xp", amount: 40 },
      },

      {
        name: "Witch",
        category: "avatar",
        isActive: true,
        imageUrl: "/shop/witch.png",
        pricing: { type: "xp", amount: 80 },
      },

      {
        name: "Butcher",
        category: "avatar",
        isActive: true,
        imageUrl: "/shop/butcher.png",
        pricing: { type: "xp", amount: 70 },
      },

      {
        name: "Detective",
        category: "avatar",
        isActive: true,
        imageUrl: "/shop/detective.png",
        pricing: { type: "xp", amount: 140 },
      },

      {
        name: "Prime",
        category: "avatar",
        isActive: true,
        imageUrl: "/shop/prime.png",
        pricing: { type: "xp", amount: 100 },
      },

      // ── Premium avatars (bought with real money via Stripe) ─────────────────
      // metadata.rarity = "premium" is used by the UI to visually distinguish paid items.
      {
        name: "Batman",
        description: "Premium avatar",
        category: "avatar",
        pricing: { type: "paid", amount: 4.98, currency: "USD" },
        imageUrl: "/shop/batman.png",
        metadata: { rarity: "premium" },
        isActive: true,
      },

      {
        name: "Hacker",
        description: "Premium avatar",
        category: "avatar",
        pricing: { type: "paid", amount: 3.98, currency: "USD" },
        imageUrl: "/shop/hacker.jpg",
        metadata: { rarity: "premium" },
        isActive: true,
      },

      {
        name: "Targarian",
        description: "Premium avatar",
        category: "avatar",
        pricing: { type: "paid", amount: 6.98, currency: "USD" },
        imageUrl: "/shop/targarian.jpg",
        metadata: { rarity: "premium" },
        isActive: true,
      },

      {
        name: "Superman",
        description: "Premium avatar",
        category: "avatar",
        pricing: { type: "paid", amount: 4.98, currency: "USD" },
        imageUrl: "/shop/superman.jpg",
        metadata: { rarity: "premium" },
        isActive: true,
      },

      // Note: Wizard uses token pricing despite having metadata — the themeKey here
      // is informational only and does not apply a theme (it is an avatar, not a theme item).
      {
        name: "Wizard",
        description: "Premium avatar",
        category: "avatar",
        pricing: { type: "xp", amount: 250 },
        imageUrl: "/shop/wizard.png",
        metadata: { themeKey: "dark_neon" },
        isActive: true,
      },

      {
        name: "Steve",
        description: "Premium avatar",
        category: "avatar",
        pricing: { type: "paid", amount: 4.98, currency: "USD" },
        imageUrl: "/shop/steve.jpg",
        metadata: { rarity: "premium" },
        isActive: true,
      },

      {
        name: "The North",
        description: "Exclusive badge for your profile.",
        category: "avatar",
        pricing: { type: "paid", amount: 6.66, currency: "USD" },
        imageUrl: "/shop/north.jpg",
        metadata: { badgeType: "legend" }, // "legend" badge type — could be used for special UI treatment
        isActive: true,
      },
    ];

    // --- Upsert each item by name ---
    // updateOne with upsert:true means:
    //   - If an item with this name already exists → update its fields ($set)
    //   - If it doesn't exist yet → create it as a new document
    // This makes the script idempotent — safe to re-run without creating duplicates.
    for (const item of items) {
      await ShopItem.updateOne(
        { name: item.name },   // Match condition: find by name
        { $set: item },        // Update: overwrite all fields with latest values
        { upsert: true }       // Insert if no match found
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
