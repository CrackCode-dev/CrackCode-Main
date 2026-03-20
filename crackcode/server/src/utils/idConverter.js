import mongoose from 'mongoose';

// Convert string ID to MongoDB ObjectId if needed
export const ensureObjectId = (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  }
  return id;
};

// Validate if string is valid MongoDB ObjectId format
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Safe conversion with error handling
export const safeObjectId = (id) => {
  try {
    return ensureObjectId(id);
  } catch (error) {
    console.error(`Failed to convert ID: ${id}`, error.message);
    return null;
  }
};
