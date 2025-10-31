const User = require("../models/user");
const CardApplication = require("../models/cardApplication");

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Exclude password field and get all users except the requesting admin
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select("-password -verification")
      .sort({ createdAt: -1 });

    const totalUsers = users.length;
    const totalAdmins = users.filter((user) => user.role === "admin").length;
    const totalRegularUsers = users.filter((user) => user.role === "user").length;
    const verifiedUsers = users.filter((user) => user.isVerified).length;

    res.status(200).json({
      message: "Users retrieved successfully",
      users,
      stats: {
        total: totalUsers,
        admins: totalAdmins,
        regularUsers: totalRegularUsers,
        verified: verifiedUsers,
        unverified: totalUsers - verifiedUsers,
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
};

// Get single user details (admin only)
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password -verification");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's application if exists
    const application = await CardApplication.findOne({ userId: user._id });

    res.status(200).json({
      message: "User details retrieved successfully",
      user,
      application,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      message: "Failed to retrieve user details",
      error: error.message,
    });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting own account
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    // Delete user's application if exists
    await CardApplication.deleteOne({ userId: user._id });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User deleted successfully",
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Must be 'user' or 'admin'",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent changing own role
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        message: "You cannot change your own role",
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: `User role updated to ${role} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      message: "Failed to update user role",
      error: error.message,
    });
  }
};
