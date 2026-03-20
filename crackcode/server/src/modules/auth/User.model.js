import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
   
    // AUTHENTICATION & PROFILE
    
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /.+\@.+\..+/,
    },

    password: {
      type: String,
      required: true,
    },

    acceptedTC: {
      type: Boolean,
      required: true,
      default: false,
    },

    // Profile
    avatar: {
      type: String,
      default: "",
    },

    avatarType: {
      type: String,
      enum: ["default", "uploaded"],
      default: "default",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
 
    // VERIFICATION & SECURITY

    isAccountVerified: {
      type: Boolean,
      default: false,
    },

    verifyotp: {
      type: String,
      default: "",
    },

    verifyotpExpireAt: {
      type: Date,
      default: null,
    },

    resetotp: {
      type: String,
      default: "",
    },

    resetotpExpireAt: {
      type: Date,
      default: null,
    },

    accountStatus: {
      type: String,
      enum: ["active", "suspended", "deleted", "banned"],
      default: "active",
    },

  
    // GAME PROFILE

    username: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 20,
      match: /^[a-z0-9_-]+$/,
    },

    level: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    totalXP: {
      type: Number,
      default: 0,
      min: 0,
    },

    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    tokens: {
      type: Number,
      default: 20,
      min: 0,
    },

    rank: {
      type: String,
      enum: ["Rookie", "Bronze", "Silver", "Gold", "Platinum", "Diamond"],
      default: "Rookie",
    },

    casesSolved: {
      type: Number,
      default: 0,
      min: 0,
    },

    // COMPLETED QUESTIONS TRACKING
    completedQuestionIds: [
      {
        type: String,
      }
    ],

    completedQuestions: [
      {
        questionId: String,
        completedAt: {
          type: Date,
          default: Date.now,
        },
        language: String,
        xpAwarded: Number,
        tokensAwarded: Number,
      }
    ],

    // ACTIVITY TRACKING

    lastActive: {
      type: Date,
      default: Date.now,
    },
 
    // ACCOUNT SETTINGS

    emailSettings: {
      notifications: {
        type: Boolean,
        default: true,
      },
      securityAlerts: {
        type: Boolean,
        default: true,
      },
      weeklyDigest: {
        type: Boolean,
        default: true,
      },
      leaderboardUpdates: {
        type: Boolean,
        default: true,
      },
    },

    equippedAvatarItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopItem",
      default: null,
    },
    
    equippedThemeItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopItem",
      default: null,
    },
    
    equippedTitleItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopItem",
      default: null,
    },

    // ACHIEVEMENTS
    profileVisibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
 
    // ACHIEVEMENTS & BADGES

    achievements: [
      {
        achievement: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Achievement",
        },
        unlockedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    //  BADGES SYSTEM 
    unlockedBadges: [
      {
        type: String,
        enum: [
          'welcome',
          'beginner',
          'cases_5',
          'cases_10',
          'cases_25',
          'top_3_leaderboard',
          'python_complete',
          'cpp_complete',
          'java_complete',
          'javascript_complete',
          'career_map_complete'
        ]
      }
    ],

    // SOLVED CHALLENGES TRACKING
    solvedChallengeIds: [
      {
        type: String,
        default: []
      }
    ],

    badgeCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    //  CAREER TRACKING 
    completedCareers: [
      {
        type: String,
        enum: ['MLEngineer', 'DataScientist', 'SoftwareEngineer']
      }
    ],

    leaderboardPosition: {
      type: Number,
      default: null,
      min: 1
    },
  },
  { timestamps: true }


);

// DATABASE INDEXES

// Frequently queried fields
// email and username have `unique: true` at the field level —
// avoid duplicate schema-level index declarations.

// Leaderboard queries
userSchema.index({ rank: 1, totalXP: -1 });
userSchema.index({ totalXP: -1 });
userSchema.index({ level: -1, totalXP: -1 });

// Activity tracking
userSchema.index({ lastActive: -1 });

// Account status
userSchema.index({ accountStatus: 1 });
userSchema.index({ isAccountVerified: 1 });

// Date-based queries
userSchema.index({ createdAt: -1 });

export default mongoose.model("User", userSchema);
