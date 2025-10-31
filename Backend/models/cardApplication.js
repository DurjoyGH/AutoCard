const mongoose = require("mongoose");

const cardApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    studentID: { type: String, required: true },
    hallName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    emergencyPhoneNumber: { type: String, required: true },
    district: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    profilePicture: { type: String, required: true },
    signature: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    appliedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

// Ensure one application per user
cardApplicationSchema.index({ userId: 1 }, { unique: true });

const CardApplication = mongoose.model("CardApplication", cardApplicationSchema);

module.exports = CardApplication;
