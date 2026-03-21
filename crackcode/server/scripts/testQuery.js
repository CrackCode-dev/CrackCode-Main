import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI;

async function test() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI not defined in .env");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Connected");

    // Search for py_fundamentals_001
    const question = await Question.findOne({ problemId: "py_fundamentals_001" });
    
    if (!question) {
      console.log("❌ Question 'py_fundamentals_001' not found");
      console.log("\n📋 Debugging: Show available questions");
      const allQuestions = await mongoose.connection.db
        .collection("learnPythonFundamentalsQ")
        .find({})
        .project({ problemId: 1, "original.title": 1 })
        .limit(5)
        .toArray();
      console.log("Available questions:", JSON.stringify(allQuestions, null, 2));
      process.exit(1);
    }

    console.log("\n✅ Question found!");
    console.log("📌 Problem ID:", question.problemId);
    console.log("📖 Title:", question.original?.title || "N/A");
    console.log("📊 Difficulty:", question.difficulty || "N/A");
    console.log("🏷️  Topic:", question.topic || "N/A");
    console.log("📦 Variants count:", question.variants?.length || 0);
    console.log("🔤 Languages:", question.variants?.map(v => v.language).join(", ") || "None");

    const pythonVariant = question.variants?.find(v => v.language === "python");
    if (pythonVariant) {
      console.log("\n✅ Python variant found!");
      console.log("   Variant ID:", pythonVariant.variantId);
      console.log("   Narrative:", pythonVariant.narrative?.title || "N/A");
      console.log("   Test Cases:", question.test_cases?.length || 0);
      console.log("\n📝 Sample Starter Code:");
      console.log("   " + (pythonVariant.starterCode?.split("\n")[0] || "N/A"));
    } else {
      console.log("❌ Python variant NOT found");
    }

    console.log("\n✅ Test complete");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

import Question from "../src/modules/learn/Question.model.js";
test();
