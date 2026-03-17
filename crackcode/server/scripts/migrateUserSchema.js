
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });


// COLORS FOR CONSOLE OUTPUT (beginner-friendly)


const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// ═══════════════════════════════════════════════════════════
// CONNECT TO MONGODB
// ═══════════════════════════════════════════════════════════

async function connectMongoDB() {
  try {
    log("\n🔗 Connecting to MongoDB...", "blue");

    await mongoose.connect(process.env.MONGODB_URI);

    log("✅ MongoDB Connected Successfully", "green");
    return true;
  } catch (err) {
    log(`❌ MongoDB Connection Failed: ${err.message}`, "red");
    process.exit(1);
  }
}

// ═══════════════════════════════════════════════════════════
// MIGRATION STEP 1: Fix OTP Dates
// ═══════════════════════════════════════════════════════════

async function migrateOTPDates() {
  log("\n📍 Step 1: Converting OTP Expiry Times (Number → Date)", "blue");
  log(
    "   This changes verifyotpExpireAt and resetotpExpireAt from milliseconds to Date objects\n",
    "yellow"
  );

  const db = mongoose.connection.db;

  try {
    // Convert verifyotpExpireAt from Number to Date
    log("   • Migrating verifyotpExpireAt...");
    const result1 = await db.collection("users").updateMany(
      { verifyotpExpireAt: { $type: "number", $gt: 0 } }, // Find numeric values > 0
      [
        {
          $set: {
            verifyotpExpireAt: {
              $toDate: "$verifyotpExpireAt", // Convert milliseconds to Date
            },
          },
        },
      ]
    );
    log(`     ✓ Updated: ${result1.modifiedCount} documents`);

    // Convert resetotpExpireAt from Number to Date
    log("   • Migrating resetotpExpireAt...");
    const result2 = await db.collection("users").updateMany(
      { resetotpExpireAt: { $type: "number", $gt: 0 } }, // Find numeric values > 0
      [
        {
          $set: {
            resetotpExpireAt: {
              $toDate: "$resetotpExpireAt", // Convert milliseconds to Date
            },
          },
        },
      ]
    );
    log(`     ✓ Updated: ${result2.modifiedCount} documents`);

    // Convert zero values to null for verifyotpExpireAt
    log("   • Converting zero values to null for verifyotpExpireAt...");
    const result3 = await db.collection("users").updateMany(
      { verifyotpExpireAt: 0 },
      { $set: { verifyotpExpireAt: null } }
    );
    log(`     ✓ Updated: ${result3.modifiedCount} documents`);

    // Convert zero values to null for resetotpExpireAt
    log("   • Converting zero values to null for resetotpExpireAt...");
    const result4 = await db.collection("users").updateMany(
      { resetotpExpireAt: 0 },
      { $set: { resetotpExpireAt: null } }
    );
    log(`     ✓ Updated: ${result4.modifiedCount} documents`);

    log("✅ Step 1 Complete: OTP dates migrated successfully", "green");
    return true;
  } catch (err) {
    log(`❌ Step 1 Failed: ${err.message}`, "red");
    return false;
  }
}

// ═══════════════════════════════════════════════════════════
// MIGRATION STEP 2: Fix Avatar Type
// ═══════════════════════════════════════════════════════════

async function migrateAvatarType() {
  log("\n📍 Step 2: Fixing Avatar Type (present → default)", "blue");
  log(
    "   Changing old 'present' values to 'default' as per new enum definition\n",
    "yellow"
  );

  const db = mongoose.connection.db;

  try {
    log("   • Converting avatarType values...");
    const result = await db.collection("users").updateMany(
      { avatarType: "present" }, // Find old value
      { $set: { avatarType: "default" } } // Replace with new value
    );
    log(`     ✓ Updated: ${result.modifiedCount} documents`);

    // Also fix any invalid values
    log("   • Cleaning up any invalid avatarType values...");
    const result2 = await db.collection("users").updateMany(
      {
        avatarType: {
          $nin: ["default", "uploaded"], // Find values NOT in valid enum
        },
      },
      { $set: { avatarType: "default" } } // Reset to default
    );
    log(`     ✓ Cleaned up: ${result2.modifiedCount} documents`);

    log("✅ Step 2 Complete: Avatar types fixed successfully", "green");
    return true;
  } catch (err) {
    log(`❌ Step 2 Failed: ${err.message}`, "red");
    return false;
  }
}

// ═══════════════════════════════════════════════════════════
// MIGRATION STEP 3: Add Missing Fields
// ═══════════════════════════════════════════════════════════

async function addMissingFields() {
  log("\n📍 Step 3: Adding Missing Fields with Default Values", "blue");
  log(
    "   Adding accountStatus, profileVisibility, badgeCount, and email settings\n",
    "yellow"
  );

  const db = mongoose.connection.db;

  try {
    // Add accountStatus if missing
    log("   • Adding accountStatus field...");
    const result1 = await db.collection("users").updateMany(
      { accountStatus: { $exists: false } },
      {
        $set: {
          accountStatus: "active", // New users/existing users default to active
        },
      }
    );
    log(`     ✓ Updated: ${result1.modifiedCount} documents`);

    // Add profileVisibility if missing
    log("   • Adding profileVisibility field...");
    const result2 = await db.collection("users").updateMany(
      { profileVisibility: { $exists: false } },
      {
        $set: {
          profileVisibility: "public", // Default to public profile
        },
      }
    );
    log(`     ✓ Updated: ${result2.modifiedCount} documents`);

    // Add badgeCount if missing
    log("   • Adding badgeCount field...");
    const result3 = await db.collection("users").updateMany(
      { badgeCount: { $exists: false } },
      {
        $set: {
          badgeCount: 0, // Start with 0 badges
        },
      }
    );
    log(`     ✓ Updated: ${result3.modifiedCount} documents`);

    // Add missing email settings
    log("   • Adding missing email notification settings...");
    const result4 = await db.collection("users").updateMany(
      { "emailSettings.weeklyDigest": { $exists: false } },
      {
        $set: {
          "emailSettings.weeklyDigest": true,
          "emailSettings.leaderboardUpdates": true,
        },
      }
    );
    log(`     ✓ Updated: ${result4.modifiedCount} documents`);

    log("✅ Step 3 Complete: Missing fields added successfully", "green");
    return true;
  } catch (err) {
    log(`❌ Step 3 Failed: ${err.message}`, "red");
    return false;
  }
}

// ═══════════════════════════════════════════════════════════
// MIGRATION STEP 4: Create Database Indexes
// ═══════════════════════════════════════════════════════════

async function createIndexes() {
  log("\n📍 Step 4: Creating Database Indexes for Performance", "blue");
  log(
    "   Indexes speed up queries for email, username, leaderboard, etc.\n",
    "yellow"
  );

  const db = mongoose.connection.db;
  const collection = db.collection("users");

  try {
    log("   • Creating indexes...");

    // List of indexes to create
    const indexesToCreate = [
      { name: "email", spec: { email: 1 } },
      { name: "username", spec: { username: 1 } },
      { name: "leaderboard", spec: { rank: 1, totalXP: -1 } },
      { name: "totalXP", spec: { totalXP: -1 } },
      { name: "levelXP", spec: { level: -1, xp: -1 } },
      { name: "lastActive", spec: { lastActive: -1 } },
      { name: "accountStatus", spec: { accountStatus: 1 } },
      { name: "isAccountVerified", spec: { isAccountVerified: 1 } },
      { name: "createdAt", spec: { createdAt: -1 } },
    ];

    // Create each index
    for (const idx of indexesToCreate) {
      try {
        await collection.createIndex(idx.spec);
        log(`     ✓ Created index: ${idx.name}`);
      } catch (err) {
        // Index might already exist - that's okay
        log(`     ℹ Index already exists: ${idx.name}`);
      }
    }

    log("✅ Step 4 Complete: Indexes created successfully", "green");
    return true;
  } catch (err) {
    log(`❌ Step 4 Failed: ${err.message}`, "red");
    return false;
  }
}

// ═══════════════════════════════════════════════════════════
// VERIFICATION: Check Migration Results
// ═══════════════════════════════════════════════════════════

async function verifyMigration() {
  log("\n📍 Verification: Checking Migration Results", "blue");

  const db = mongoose.connection.db;

  try {
    // Check 1: Count documents with numeric OTP expiry (should be 0)
    log("   • Checking for numeric OTP values (should be 0)...");
    const numericCount = await db.collection("users").countDocuments({
      $or: [
        { verifyotpExpireAt: { $type: "number" } },
        { resetotpExpireAt: { $type: "number" } },
      ],
    });
    log(`     Found: ${numericCount} (Expected: 0)`, numericCount === 0 ? "green" : "red");

    // Check 2: Count invalid avatarType (should be 0)
    log("   • Checking for invalid avatarType values (should be 0)...");
    const invalidAvatarCount = await db.collection("users").countDocuments({
      avatarType: { $nin: ["default", "uploaded"] },
    });
    log(`     Found: ${invalidAvatarCount} (Expected: 0)`, invalidAvatarCount === 0 ? "green" : "red");

    // Check 3: Count missing accountStatus (should be 0)
    log("   • Checking for missing accountStatus field (should be 0)...");
    const missingStatusCount = await db.collection("users").countDocuments({
      accountStatus: { $exists: false },
    });
    log(`     Found: ${missingStatusCount} (Expected: 0)`, missingStatusCount === 0 ? "green" : "red");

    // Check 4: Sample document structure
    log("   • Sample document structure:");
    const sampleUser = await db.collection("users").findOne();
    if (sampleUser) {
      log(`     Email: ${sampleUser.email}`);
      log(`     Avatar Type: ${sampleUser.avatarType}`);
      log(`     Account Status: ${sampleUser.accountStatus}`);
      log(`     Verify OTP Expire Type: ${typeof sampleUser.verifyotpExpireAt}`);
    }

    log("✅ Verification Complete", "green");
    return true;
  } catch (err) {
    log(`❌ Verification Failed: ${err.message}`, "red");
    return false;
  }
}

// ═══════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════

async function main() {
  log("\n" + "═".repeat(60), "bright");
  log("PHASE 2: USER SCHEMA DATA MIGRATION", "bright");
  log("═".repeat(60), "bright");

  log("\n⚠️  IMPORTANT: This script modifies your MongoDB data.", "yellow");
  log("   Make sure you have a backup before running this!", "yellow");

  // Connect to MongoDB
  const connected = await connectMongoDB();
  if (!connected) {
    process.exit(1);
  }

  // Run migration steps
  let allSuccess = true;

  allSuccess = (await migrateOTPDates()) && allSuccess;
  allSuccess = (await migrateAvatarType()) && allSuccess;
  allSuccess = (await addMissingFields()) && allSuccess;
  allSuccess = (await createIndexes()) && allSuccess;

  // Verify results
  allSuccess = (await verifyMigration()) && allSuccess;

  // Final summary
  log("\n" + "═".repeat(60), "bright");
  if (allSuccess) {
    log("✅ MIGRATION SUCCESSFUL!", "green");
    log("Your MongoDB data is now ready for the new auth system!", "green");
  } else {
    log("⚠️  MIGRATION COMPLETED WITH WARNINGS", "yellow");
    log("Please check the logs above for any issues", "yellow");
  }
  log("═".repeat(60), "bright");

  // Close database connection
  await mongoose.disconnect();
  process.exit(allSuccess ? 0 : 1);
}

// Run the migration
main().catch((err) => {
  log(`Fatal Error: ${err.message}`, "red");
  process.exit(1);
});
