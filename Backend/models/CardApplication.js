const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/db");
const User = require("./User");

const CardApplication = sequelize.define(
  "CardApplication",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hallName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emergencyPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bloodGroup: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    appliedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    reviewedAt: {
      type: DataTypes.DATE,
    },
    reviewedBy: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
    },
    rejectionReason: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["userId"],
        unique: true,
      },
    ],
  }
);

// Associations
User.hasMany(CardApplication, { foreignKey: "userId", as: "applications" });
CardApplication.belongsTo(User, { foreignKey: "userId", as: "applicant" });

// Association for reviewer (admin who reviewed the application)
CardApplication.belongsTo(User, { foreignKey: "reviewedBy", as: "reviewer" });

module.exports = CardApplication;
