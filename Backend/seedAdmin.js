require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("./models/User");
const { connectDB } = require("./configs/db");

const seedAdmin = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to database");

    // Admin user data
    const adminData = {
      name: "AutoCard Admin",
      email: "autocard.admin@gmail.com",
      password: "autocard@admin",
      role: "admin",
      isVerified: true,
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: adminData.email } });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email:", existingAdmin.email);
      console.log("Role:", existingAdmin.role);
      process.exit(0);
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Create admin user
    const adminUser = await User.create({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: adminData.role,
      isVerified: adminData.isVerified,
    });

    console.log("✅ Admin user created successfully!");
    console.log("=====================================");
    console.log("Email:", adminData.email);
    console.log("Password:", adminData.password);
    console.log("Role:", adminData.role);
    console.log("=====================================");
    console.log("You can now login with these credentials");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

// Run the seed function
seedAdmin();
