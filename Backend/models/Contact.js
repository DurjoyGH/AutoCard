const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/db");
const User = require("./User");

const Contact = sequelize.define(
  "Contact",
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
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "replied", "closed"),
      defaultValue: "pending",
    },
    replyMessage: {
      type: DataTypes.TEXT,
    },
    repliedBy: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
    },
    repliedAt: {
      type: DataTypes.DATE,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["status", "createdAt"],
      },
      {
        fields: ["email"],
      },
      {
        fields: ["isRead"],
      },
    ],
  }
);

User.hasMany(Contact, { foreignKey: "repliedBy" });
Contact.belongsTo(User, { foreignKey: "repliedBy" });

module.exports = Contact;
