require("dotenv").config();
require("colors");

const { connectDB } = require("./configs/db");

const app = require("./app");

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`.yellow.bold);
});
