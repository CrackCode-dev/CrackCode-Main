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
