import mongoose from "mongoose";
import Question from "./Question.model.js";

// Get all questions with filtering
export const getAllQuestions = async (req, res) => {
  try {
    const { difficulty, topic, language } = req.query;
    const filter = {};

    if (difficulty) filter.difficulty = difficulty;
    if (topic) filter.topic = topic;

    const questions = await Question.find(filter).select(
      "problemId original.title original.description difficulty topic examples constraints variants"
    );

    return res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single question by ID (full details with test cases)
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find by problemId
    let question = await Question.findOne({ problemId: id });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get question with specific language variant
export const getQuestionByIdAndLanguage = async (req, res) => {
  try {
    const { id, language } = req.params;
    console.log("🔍 Fetching question:", { id, language });

    let question = await Question.findOne({ problemId: id });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    console.log("✅ Question found. Variants count:", question.variants.length);
    console.log("📊 Available languages:", question.variants.map(v => v.language));

    // Filter variant by language
    const variant = question.variants.find((v) => v.language === language);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: `Variant for language '${language}' not found`,
      });
    }

    // Return combined response with the specific variant
    return res.status(200).json({
      success: true,
      data: {
        problemId: question.problemId,
        original: question.original,
        difficulty: question.difficulty,
        topic: question.topic,
        story: question.story,
        examples: question.examples,
        constraints: question.constraints,
        test_cases: question.test_cases,
        variant: variant,
      },
    });
  } catch (error) {
    console.error("❌ Error in getQuestionByIdAndLanguage:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create a new question (admin only)
export const createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    return res.status(201).json({
      success: true,
      data: question,
      message: "Question created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update question
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    let question = await Question.findOneAndUpdate(
      { $or: [{ problemId: id }, { _id: id }] },
      req.body,
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: question,
      message: "Question updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findOneAndDelete({
      $or: [{ problemId: id }, { _id: id }],
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Fetch questions from a dynamically-named collection 
export const getCollectionQuestions = async (req, res) => {
  try {
    const { language, difficulty } = req.query;

    if (!language || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "language and difficulty query parameters are required",
      });
    }

    const langMap = { python: "Python", javascript: "Javascript", java: "Java", cpp: "Cpp" };
    const diffMap = { fundamentals: "Fundamentals", easy: "Easy", intermediate: "Medium", hard: "Hard" };

    const langKey = language.toLowerCase();
    const diffKey = difficulty.toLowerCase();

    if (!langMap[langKey] || !diffMap[diffKey]) {
      return res.status(400).json({
        success: false,
        message: `Invalid language '${language}' or difficulty '${difficulty}'`,
      });
    }

    const collectionName = `learn${langMap[langKey]}${diffMap[diffKey]}Q`;
    const questions = await mongoose.connection.db.collection(collectionName).find({}).limit(15).toArray();

    return res.status(200).json({
      success: true,
      count: questions.length,
      collectionName,
      data: questions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get daily challenge (rotates every 24 hours using day-based seed)
export const getDailyChallenge = async (req, res) => {
  try {
    // Query the challengeJavaQ collection directly
    const collection = mongoose.connection.db.collection('challengeJavaQ');
    const challenges = await collection.find({}).toArray();

    if (!challenges || challenges.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No challenges available",
      });
    }

    // Use today's date as a seed for deterministic daily rotation
    const today = new Date();
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    const index = daysSinceEpoch % challenges.length;

    const dailyQuestion = challenges[index];

    return res.status(200).json({
      success: true,
      data: {
        problemId: dailyQuestion.problemId,
        title: dailyQuestion.original.title,
        description: dailyQuestion.original.description,
        difficulty: dailyQuestion.difficulty,
        topic: dailyQuestion.topic,
        examples: dailyQuestion.examples,
        constraints: dailyQuestion.constraints,
        test_cases: dailyQuestion.test_cases,
        variants: dailyQuestion.variants,
      },
    });
  } catch (error) {
    console.error("❌ getDailyChallenge error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Fetch an arbitrary challenge collection by name (e.g., 'challengePythonQ')
export const getChallengesCollection = async (req, res) => {
  try {
    const { collection } = req.query;

    const collectionName = collection || 'challengePythonQ';

    // Basic validation: collection name should be a non-empty string
    if (typeof collectionName !== 'string' || collectionName.trim() === '') {
      return res.status(400).json({ success: false, message: 'Invalid collection name' });
    }

    const items = await mongoose.connection.db.collection(collectionName).find({}).toArray();

    return res.status(200).json({ success: true, count: items.length, collectionName, data: items });
  } catch (error) {
    console.error('❌ getChallengesCollection error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Shortcut endpoint specifically for weekly challenges (Javascript collection)
export const getWeeklyChallenge = async (_req, res) => {
  try {
    const collectionName = 'challengeJavascriptQ';
    const items = await mongoose.connection.db.collection(collectionName).find({}).toArray();
    return res.status(200).json({ success: true, count: items.length, collectionName, data: items });
  } catch (error) {
    console.error('❌ getWeeklyChallenge error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
