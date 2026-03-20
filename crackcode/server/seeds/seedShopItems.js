// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import mongoose from "mongoose";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.join(__dirname, "../.env") });

// import ShopItem from "../src/modules/shop/ShopItem.model.js";

// const run = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("✅ Mongo connected");

//     const items = [

//       {
//         name: "Cena",
//         category: "avatar",
//         isActive: true,
//         imageUrl: "/uploads/avatars/Cena.png",
//         pricing: { type: "xp", amount: 50 },
//       },

//       {
//         name: "Detective",
//         category: "avatar",
//         isActive: true,
//         imageUrl: "/uploads/avatars/Detective.png",
//         pricing: { type: "xp", amount: 140 },
//       },

//       {
//         name: "Prime",
//         category: "avatar",
//         isActive: true,
//         imageUrl: "/uploads/avatars/Prime.png",
//         pricing: { type: "xp", amount: 100 },
//       },

//       {
//         name: "Batman",
//         description: "Premium avatar",
//         category: "avatar",
//         pricing: { type: "paid", amount: 4.98, currency: "USD" },
//         imageUrl: "/uploads/avatars/Batman.png",
//         metadata: {
//           rarity: "premium",
//         },
//         isActive: true,
//       },

//       {
//         name: "Superman",
//         description: "Premium avatar",
//         category: "avatar",
//         pricing: { type: "paid", amount: 4.98, currency: "USD" },
//         imageUrl: "/uploads/avatars/Superman.jpg",
//         metadata: {
//           rarity: "premium",
//         },
//         isActive: true,
//       },

//       {
//         name: "Wizard",
//         description: "Premium avatar",
//         category: "avatar",
//         pricing: { type: "xp", amount: 250 },
//         imageUrl: "/uploads/avatars/Wizard.png",
//         metadata: {
//           themeKey: "dark_neon",
//         },
//         isActive: true,
//       },

//       {
//         name: "Steve",
//         description: "Premium avatar",
//         category: "avatar",
//         pricing: { type: "paid", amount: 4.98, currency: "USD" },
//         imageUrl: "/uploads/avatars/Steve.jpg",
//         metadata: {
//           rarity: "premium",
//         },
//         isActive: true,
//       },

//       {
//         name: "The North",
//         description: "Exclusive badge for your profile.",
//         category: "avatar",
//         pricing: { type: "paid", amount: 6.66, currency: "USD" },
//         imageUrl: "/uploads/avatars/North.jpg",
//         metadata: {
//           badgeType: "legend",
//         },
//         isActive: true,
//       },
//     ];

//     for (const item of items) {
//       await ShopItem.updateOne(
//         { name: item.name },
//         { $set: item },
//         { upsert: true }
//       );
//     }

//     console.log("✅ Shop items updated");
//     process.exit(0);
//   } catch (e) {
//     console.error("❌ Seed failed:", e.message);
//     process.exit(1);
//   }
// };

// run();


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
        name: "Country Theme",
        description: "A warm rustic country-style theme for your profile.",
        category: "theme",
        pricing: { type: "paid", amount: 6, currency: "USD" },
        imageUrl: "/uploads/themes/country.png",
        metadata: { themeKey: "country" },
        isActive: true,
      },

      {
        name: "Midnight Theme",
        description: "A sleek deep-blue midnight theme for your profile.",
        category: "theme",
        pricing: { type: "paid", amount: 6, currency: "USD" },
        imageUrl: "/uploads/themes/midnight.png",
        metadata: { themeKey: "midnight" },
        isActive: true,
      },

      {
        name: "Cena",
        category: "avatar",
        isActive: true,
        imageUrl: "/uploads/avatars/Cena.png",
        pricing: { type: "tokens", amount: 50 },
      },

      {
        name: "Detective",
        category: "avatar",
        isActive: true,
        imageUrl: "/uploads/avatars/Detective.png",
        pricing: { type: "tokens", amount: 140 },
      },

      {
        name: "Prime",
        category: "avatar",
        isActive: true,
        imageUrl: "/uploads/avatars/Prime.png",
        pricing: { type: "tokens", amount: 100 },
      },

      {
        name: "Batman",
        description: "Premium avatar",
        category: "avatar",
        pricing: { type: "paid", amount: 4.98, currency: "USD" },
        imageUrl: "/uploads/avatars/Batman.png",
        metadata: {
          rarity: "premium",
        },
        isActive: true,
      },

      {
        name: "Superman",
        description: "Premium avatar",
        category: "avatar",
        pricing: { type: "paid", amount: 4.98, currency: "USD" },
        imageUrl: "/uploads/avatars/Superman.jpg",
        metadata: {
          rarity: "premium",
        },
        isActive: true,
      },

      {
        name: "Wizard",
        description: "Premium avatar",
        category: "avatar",
        pricing: { type: "tokens", amount: 250 },
        imageUrl: "/uploads/avatars/Wizard.png",
        metadata: {
          themeKey: "dark_neon",
        },
        isActive: true,
      },

      {
        name: "Steve",
        description: "Premium avatar",
        category: "avatar",
        pricing: { type: "paid", amount: 4.98, currency: "USD" },
        imageUrl: "/uploads/avatars/Steve.jpg",
        metadata: {
          rarity: "premium",
        },
        isActive: true,
      },

      {
        name: "The North",
        description: "Exclusive badge for your profile.",
        category: "avatar",
        pricing: { type: "paid", amount: 6.66, currency: "USD" },
        imageUrl: "/uploads/avatars/North.jpg",
        metadata: {
          badgeType: "legend",
        },
        isActive: true,
      },
    ];

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