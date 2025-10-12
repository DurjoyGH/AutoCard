require("colors");
const mongoose = require("mongoose");
const dbConnection = process.env.DB_URL;

const connectDB = async () => {
  mongoose
    .connect(dbConnection, {})
    .then(() => console.log("Database connection established".green.bold))
    .catch((err) => {
      console.error("Database connection failed".red.bold);
      console.error(err);
    });
};

module.exports = connectDB;
