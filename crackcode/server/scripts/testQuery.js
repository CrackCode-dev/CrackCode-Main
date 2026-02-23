import mongoose from "mongoose";
import Question from "../src/modules/learn/Question.model.js";

const MONGODB_URI = "mongodb+srv://infocrackcode_db_user:Up3qn0HqPFN1xQ73@crackcodecluster.f8j0sea.mongodb.net/?appName=crackcodeCluster";

async function test() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Connected");

    const question = await Question.findOne({ problemId: "prob_000067" });
    
    if (!question) {
      console.log("❌ Question not found");
      process.exit(1);
    }

    console.log("✅ Question found:", question.problemId);
    console.log("📊 Variants count:", question.variants.length);
    console.log("🔤 Variant languages:", question.variants.map(v => v.language).join(", "));

    const pythonVariant = question.variants.find(v => v.language === "python");
    if (pythonVariant) {
      console.log("✅ Python variant found");
      console.log("   Title:", pythonVariant.narrative.title);
    } else {
      console.log("❌ Python variant NOT found");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

test();
