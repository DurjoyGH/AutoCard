const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    studentID: {
      type: DataTypes.STRING,
    },
    department: {
      type: DataTypes.STRING,
    },
    hallName: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    emergencyPhoneNumber: {
      type: DataTypes.STRING,
    },
    district: {
      type: DataTypes.STRING,
    },
    bloodGroup: {
      type: DataTypes.ENUM("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"),
    },
    profilePicture: {
      type: DataTypes.STRING,
    },
    signature: {
      type: DataTypes.STRING,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
    },
    verificationTokenCreatedAt: {
      type: DataTypes.DATE,
    },
    verificationTokenExpiresAt: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User;
