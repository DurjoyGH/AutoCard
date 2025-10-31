require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./configs/db");

const fixIndexes = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to database");

    // Wait for connection to be ready
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // Get all indexes
    const indexes = await usersCollection.indexes();
    console.log("\nCurrent indexes:");
    indexes.forEach((index) => {
      console.log("- ", index.name, JSON.stringify(index.key));
    });

    // Drop the problematic TTL index if it exists
    try {
      await usersCollection.dropIndex("verification.createdAt_1");
      console.log("\n✅ Dropped old TTL index: verification.createdAt_1");
    } catch (error) {
      if (error.code === 27) {
        console.log("\n⚠️  TTL index verification.createdAt_1 not found (already removed)");
      } else {
        console.error("Error dropping index:", error.message);
      }
    }

    // Create the new TTL index on expiresAt
    try {
      await usersCollection.createIndex(
        { "verification.expiresAt": 1 },
        { expireAfterSeconds: 0, sparse: true }
      );
      console.log("✅ Created new TTL index: verification.expiresAt_1");
    } catch (error) {
      if (error.code === 85 || error.code === 86) {
        console.log("⚠️  TTL index verification.expiresAt_1 already exists");
      } else {
        console.error("Error creating index:", error.message);
      }
    }

    // Get updated indexes
    const newIndexes = await usersCollection.indexes();
    console.log("\n📋 Updated indexes:");
    newIndexes.forEach((index) => {
      console.log("- ", index.name, JSON.stringify(index.key));
      if (index.expireAfterSeconds !== undefined) {
        console.log("  └─ TTL: expires after", index.expireAfterSeconds, "seconds");
      }
    });

    console.log("\n✅ Index fix completed successfully!");
    console.log("\n💡 Your admin user will now be permanent.");
    console.log("   Only unverified users with expiresAt set will be auto-deleted.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error fixing indexes:", error);
    process.exit(1);
  }
};

// Run the fix
fixIndexes();
