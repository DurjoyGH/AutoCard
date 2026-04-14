const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/db");
const User = require("./User");
const CardApplication = require("./CardApplication");

const PaymentDetail = sequelize.define(
  "PaymentDetail",
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
    cardApplicationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: CardApplication,
        key: "id",
      },
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 100,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "BDT",
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    gateway: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "SSLCommerz-Sandbox",
    },
    gatewayResponse: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "PaymentDetails",
    timestamps: true,
    indexes: [
      { fields: ["userId"] },
      { fields: ["cardApplicationId"] },
      { fields: ["status"] },
    ],
  }
);

User.hasMany(PaymentDetail, { foreignKey: "userId", as: "payments" });
PaymentDetail.belongsTo(User, { foreignKey: "userId", as: "payer" });

CardApplication.hasMany(PaymentDetail, {
  foreignKey: "cardApplicationId",
  as: "payments",
});
PaymentDetail.belongsTo(CardApplication, {
  foreignKey: "cardApplicationId",
  as: "application",
});

module.exports = PaymentDetail;
