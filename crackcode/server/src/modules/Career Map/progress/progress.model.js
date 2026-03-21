import mongoose from "mongoose";

// Schema for tracking progress per chapter
const chapterProgressSchema = new mongoose.Schema({
  chapterId: { type: String, required: true },   
  easyScore: { type: Number, default: 0 },        
  mediumScore: { type: Number, default: 0 },      
  hardScore: { type: Number, default: 0 },       
  passed: { type: Boolean, default: false },      
  attempts: { type: Number, default: 0 },        
  // Number of questions in this chapter that have already been rewarded
  rewardedQuestions: { type: Number, default: 0 },
});

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  career: {
    type: String,
    enum: ["MLEngineer", "DataScientist", "SoftwareEngineer"],
    required: true
  },

  // Per-chapter breakdown
  chapters: [chapterProgressSchema],

  // Computed totals — sum of all chapters' scores
  easyScore: { type: Number, default: 0 },
  mediumScore: { type: Number, default: 0 },
  hardScore: { type: Number, default: 0 },

  // True when total difficulty score is high enough
  easyCompleted: { type: Boolean, default: false },
  mediumCompleted: { type: Boolean, default: false },
  hardCompleted: { type: Boolean, default: false },

  totalQuestions: { type: Number, default: 60 }

}, { timestamps: true });

// Unique index = one progress document per user per career
progressSchema.index({ userId: 1, career: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);