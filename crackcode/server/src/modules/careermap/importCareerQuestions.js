const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const csv = require("csvtojson");
const CareerQuestion = require("./CareerQuestion.model");
require("dotenv").config();

// Map CSV filename → category name (must match model enum)
const CSV_FILES = [
  { file: "Software_Questions.csv", category: "Software" },
  { file: "DataScience_Questions.csv", category: "DataScience" },
  { file: "DevOps_Questions.csv", category: "DevOps" },
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    for (const { file, category } of CSV_FILES) {
      const filePath = path.join(__dirname, file);

      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  File not found, skipping: ${file}`);
        continue;
      }

      const records = await csv().fromFile(filePath);

      // Attach category and parse options (expects options as "A|B|C|D" in CSV)
      const formatted = records.map((row) => ({
        question: row.question,
        options: row.options.split("|").map((o) => o.trim()),
        correctAnswer: row.correctAnswer,
        difficulty: row.difficulty || "Medium",
        explanation: row.explanation || "",
        category,
      }));

      // Remove existing data for this category before inserting
      await CareerQuestion.deleteMany({ category });
      await CareerQuestion.insertMany(formatted);
      console.log(`✅ Imported ${formatted.length} questions from ${file}`);
    }

    console.log("🎉 All data imported successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Import failed:", error.message);
    process.exit(1);
  }
};

importData();