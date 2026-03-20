import mongoose from 'mongoose';

const userQuestionProgressSchema = new mongoose.Schema(
  {
    // Reference to user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Question identifier
    questionId: {
      type: String,
      required: true,
    },

    // Question type: coding, mcq, bronfield, etc.
    questionType: {
      type: String,
      enum: ['coding', 'mcq', 'bronfield'],
      default: 'coding',
    },

    // Source tracking: where was this question solved from
    sourceArea: {
      type: String,
      enum: ['home_challenge', 'learn_page', 'case_log', 'career_map'],
      default: 'learn_page',
    },

    // Problem solving status
    solved: {
      type: Boolean,
      default: false,
    },

    // Reward status
    rewarded: {
      type: Boolean,
      default: false,
    },

    // Reward amounts given
    xpAwarded: {
      type: Number,
      default: 0,
      min: 0,
    },

    tokensAwarded: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Attempt tracking
    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    //  Timing
    firstSolvedAt: {
      type: Date,
      default: null,
    },

    lastSubmittedAt: {
      type: Date,
      default: null,
    },

    // Optional: code quality metrics for future use
    testCasesPassed: {
      type: Number,
      default: 0,
    },

    testCasesTotal: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Unique index to prevent duplicate progress entries per user-question-type
userQuestionProgressSchema.index(
  {
    userId: 1,
    questionId: 1,
    questionType: 1,
  },
  { unique: true }
);

// Index for quick lookups by userId
userQuestionProgressSchema.index({ userId: 1 });

// Index for analytics queries
userQuestionProgressSchema.index({ solved: 1, rewarded: 1 });

const UserQuestionProgress = mongoose.model(
  'UserQuestionProgress',
  userQuestionProgressSchema
);

export default UserQuestionProgress;
