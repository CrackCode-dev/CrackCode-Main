import mongoose from "mongoose";

const pendingRegistrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    password: { type: String, required: true }, // hashed password
    acceptedTC: { type: Boolean, required: true, default: false },
    otp: { type: String, default: "" },
    otpExpireAt: { type: Date, default: null }, // ✅ FIX: Changed from Number to Date
  },
  { timestamps: true }
);

export default mongoose.model("PendingRegistration", pendingRegistrationSchema);
