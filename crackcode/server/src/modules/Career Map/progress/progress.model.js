import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  career: {
    type: String,
    default: "ML Engineer"
  },

  easyScore: {
    type: Number,
    default: 0
  },

  mediumScore: {
    type: Number,
    default: 0
  },

  hardScore: {
    type: Number,
    default: 0
  },

  easyCompleted: {
    type: Boolean,
    default: false
  },

  mediumCompleted: {
    type: Boolean,
    default: false
  },

  hardCompleted: {
    type: Boolean,
    default: false
  }

});

export default mongoose.model("Progress", progressSchema);
