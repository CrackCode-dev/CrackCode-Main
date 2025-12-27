import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    // Profile fields
    avatar: {
      type: String,
      default: ""
    },

    bio: {
      type: String,
      default: ""
    },

    // Account Settings (Configure Email)
    emailSettings: {
      notifications: {
        type: Boolean,
        default: true
      },
      securityAlerts: {
        type: Boolean,
        default: true
      }
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", userSchema);
