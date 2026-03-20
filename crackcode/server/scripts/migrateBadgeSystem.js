import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from ../.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// Import the User model (Mongoose schema for users)
import User from "../src/modules/auth/User.model.js";

// Simple colored console helper (keeps output readable)
const colors = { reset: "\x1b[0m", green: "\x1b[32m", red: "\x1b[31m", yellow: "\x1b[33m", blue: "\x1b[36m" };
const log = (msg, color = "") => console.log(`${colors[color] || ""}${msg}${colors.reset}`);

// Connect to MongoDB using MONGODB_URI from .env
async function connectMongoDB() {
  try {
    log("Connecting to MongoDB...", "blue");
    await mongoose.connect(process.env.MONGODB_URI);
    log("MongoDB connected", "green");
  } catch (err) {
    log(`Connection failed: ${err.message}`, "red");
    process.exit(1); // stop if we cannot connect
  }
}

// STEP 1: Add `solvedChallengeIds` array if it does not exist
// This keeps track of which challenges each user solved
async function addSolvedChallengeIds() {
  try {
    log("Step 1: Adding solvedChallengeIds to users if missing", "blue");
    const result = await User.updateMany(
      { solvedChallengeIds: { $exists: false } },
      { $set: { solvedChallengeIds: [] } }
    );
    log(`Updated ${result.modifiedCount} users`, "green");
    return true;
  } catch (err) {
    log(`Step 1 failed: ${err.message}`, "red");
    return false;
  }
}

// STEP 2: Give every existing user the 'welcome' badge if they don't have it
async function unlockWelcomeBadge() {
  try {
    log("Step 2: Adding 'welcome' badge to users who lack it", "blue");
    const result = await User.updateMany(
      { unlockedBadges: { $ne: "welcome" } },
      { $addToSet: { unlockedBadges: "welcome" }, $inc: { badgeCount: 1 } }
    );
    log(`Added welcome badge to ${result.modifiedCount} users`, "green");
    return true;
  } catch (err) {
    log(`Step 2 failed: ${err.message}`, "red");
    return false;
  }
}

// STEP 3: Make sure badgeCount matches the number of unlocked badges
async function ensureBadgeCount() {
  try {
    log("Step 3: Syncing badgeCount with unlockedBadges", "blue");
    const users = await User.find({}).select("unlockedBadges badgeCount");
    let fixes = 0;
    for (const u of users) {
      const realCount = (u.unlockedBadges || []).length;
      if (u.badgeCount !== realCount) {
        u.badgeCount = realCount; // update in memory
        await u.save(); // save change
        fixes++;
      }
    }
    log(`Fixed ${fixes} users' badgeCount`, "green");
    return true;
  } catch (err) {
    log(`Step 3 failed: ${err.message}`, "red");
    return false;
  }
}

// Quick verification: show a few users to confirm changes
async function verifyMigration() {
  try {
    log("Verification: Showing sample users", "blue");
    const samples = await User.find({ solvedChallengeIds: { $exists: true } }).limit(3);
    if (samples.length === 0) {
      log("No sample users found for verification", "yellow");
      return false;
    }
    samples.forEach((u, i) => {
      log(`User ${i + 1}: ${u.email}`);
      log(`  - Badges: ${((u.unlockedBadges || []).join(", ") || "none")} (count=${u.badgeCount || 0})`);
      log(`  - Solved challenges: ${(u.solvedChallengeIds || []).length}`);
    });
    return true;
  } catch (err) {
    log(`Verification failed: ${err.message}`, "red");
    return false;
  }
}

// Run all steps in order
async function main() {
  await connectMongoDB();

  let ok = true;
  ok = (await addSolvedChallengeIds()) && ok;
  ok = (await unlockWelcomeBadge()) && ok;
  ok = (await ensureBadgeCount()) && ok;
  ok = (await verifyMigration()) && ok;

  if (ok) {
    log("Migration completed successfully", "green");
  } else {
    log("Migration completed with some issues; check logs above", "yellow");
  }

  await mongoose.disconnect();
  process.exit(ok ? 0 : 1);
}

main();
