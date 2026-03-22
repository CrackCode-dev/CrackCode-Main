import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    // Unique identifier
    problemId: {
      type: String,
      required: true,
      unique: true,
    },

    // Source information
    source: {
      dataset: String,
      source_question_id: String,
    },

    // Original problem details
    original: {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },

    // Difficulty and classification
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },

    // Bloom's taxonomy
    bloom: {
      level: String,
      score: Number,
    },

    // Story/narrative context
    story: {
      chapterId: String,
      beatId: String,
    },

    // Example cases
    examples: [
      {
        input: mongoose.Schema.Types.Mixed,
        output: mongoose.Schema.Types.Mixed,
      },
    ],

    // Constraints
    constraints: [String],

    // Test cases with expected output
    test_cases: [
      {
        input: mongoose.Schema.Types.Mixed,
        expected_output: mongoose.Schema.Types.Mixed,
      },
    ],

    // Language variants with different narratives and starter code
    variants: [
      {
        variantId: String,
        language: {
          type: String,
          enum: ["python", "javascript", "java", "cpp"],
        },
        storyId: String,
        templateId: String,
        narrative: {
          title: String,
          description: String,
        },
        starterCode: String,
      },
    ],
  },
  { timestamps: true }
);

// Index for faster queries
questionSchema.index({ topic: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ language: 1 });

export default mongoose.model("Question", questionSchema);

// Helper: find question by either ObjectId or problemId string
export async function findQuestionByIdentifier(idOrProblemId) {
  if (!idOrProblemId) return null;

  // If it's a valid ObjectId, try by _id first
  if (mongoose.Types.ObjectId.isValid(idOrProblemId)) {
    const byId = await mongoose.model("Question").findById(idOrProblemId);
    if (byId) return byId;
  }

  // Otherwise, try problemId
  return await mongoose.model("Question").findOne({ problemId: idOrProblemId });
}
