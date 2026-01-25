import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true, // e.g. "first_victory"
    },
    title: {
      type: String,
      required: true, // "First Victory"
    },
    description: {
      type: String,
      required: true, // "Won your first case"
    },
    icon: {
      type: String, // icon name or emoji (optional)
    },
  },
  { timestamps: true }
);

export default mongoose.model("Achievement", achievementSchema);
