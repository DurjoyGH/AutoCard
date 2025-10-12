const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    studentID: { type: String},
    hallName: { type: String },
    phoneNumber: { type: String},
    emergencyPhoneNumber: { type: String},
    district: { type: String },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    profilePicture: { type: String },
    signature: { type: String },
    isVerified: { type: Boolean, default: false },

    verification: {
      token: { type: String },
      createdAt: {
        type: Date,
        default: Date.now,
        expires: 300,
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
