require("colors");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Database connection established".green.bold);
  } catch (err) {
    console.error("Database connection failed".red.bold);
    console.error(err);
  }
};

module.exports = { sequelize, connectDB };
