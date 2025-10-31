require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const connectDB = require("./configs/db");

const checkAdmin = async () => {
  try {
    await connectDB();
    console.log("Connected to database\n");

    // Wait for connection
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find admin users
    const adminUsers = await User.find({ role: "admin" });

    if (adminUsers.length === 0) {
      console.log("❌ No admin users found in the database!");
      console.log("\n💡 Run 'node seedAdmin.js' to create an admin user.");
    } else {
      console.log(`✅ Found ${adminUsers.length} admin user(s):\n`);
      adminUsers.forEach((admin, index) => {
        console.log(`${index + 1}. Admin Details:`);
        console.log("   Name:", admin.name);
        console.log("   Email:", admin.email);
        console.log("   Role:", admin.role);
        console.log("   Verified:", admin.isVerified);
        console.log("   Created:", admin.createdAt);
        console.log("   Verification object:", admin.verification || "undefined (good!)");
        console.log("");
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("Error checking admin:", error);
    process.exit(1);
  }
};

checkAdmin();
