const User = require("../models/user");
const CardApplication = require("../models/cardApplication");
const bcrypt = require("bcrypt");
const {
  sendApplicationApprovedEmail,
  sendApplicationRejectedEmail,
  sendNewAdminEmail,
} = require("../services/email");

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

// Get all card applications (admin only)
exports.getAllApplications = async (req, res) => {
  try {
    const { status } = req.query; // Filter by status if provided

    const query = status && status !== "all" ? { status } : {};

    const applications = await CardApplication.find(query)
      .populate("userId", "name email studentID phoneNumber")
      .populate("reviewedBy", "name email")
      .sort({ appliedAt: -1 });

    const stats = {
      total: applications.length,
      pending: applications.filter((app) => app.status === "pending").length,
      approved: applications.filter((app) => app.status === "approved").length,
      rejected: applications.filter((app) => app.status === "rejected").length,
    };

    res.status(200).json({
      message: "Applications retrieved successfully",
      applications,
      stats,
    });
  } catch (error) {
    console.error("Get all applications error:", error);
    res.status(500).json({
      message: "Failed to retrieve applications",
      error: error.message,
    });
  }
};

// Approve card application (admin only)
exports.approveApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await CardApplication.findById(applicationId).populate(
      "userId",
      "name email"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status === "approved") {
      return res.status(400).json({
        message: "Application is already approved",
      });
    }

    application.status = "approved";
    application.reviewedAt = new Date();
    application.reviewedBy = req.user.id;
    application.rejectionReason = undefined; // Clear rejection reason if any

    await application.save();

    // Send approval email to user
    const emailResult = await sendApplicationApprovedEmail(
      application.userId.email,
      application.userId.name,
      application
    );

    if (!emailResult.success) {
      console.error("Failed to send approval email:", emailResult.error);
    }

    res.status(200).json({
      message: "Application approved successfully",
      application,
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error("Approve application error:", error);
    res.status(500).json({
      message: "Failed to approve application",
      error: error.message,
    });
  }
};

// Reject card application (admin only)
exports.rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason || rejectionReason.trim() === "") {
      return res.status(400).json({
        message: "Rejection reason is required",
      });
    }

    const application = await CardApplication.findById(applicationId).populate(
      "userId",
      "name email"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status === "rejected") {
      return res.status(400).json({
        message: "Application is already rejected",
      });
    }

    application.status = "rejected";
    application.reviewedAt = new Date();
    application.reviewedBy = req.user.id;
    application.rejectionReason = rejectionReason;

    await application.save();

    // Send rejection email to user
    const emailResult = await sendApplicationRejectedEmail(
      application.userId.email,
      application.userId.name,
      application,
      rejectionReason
    );

    if (!emailResult.success) {
      console.error("Failed to send rejection email:", emailResult.error);
    }

    res.status(200).json({
      message: "Application rejected successfully",
      application,
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error("Reject application error:", error);
    res.status(500).json({
      message: "Failed to reject application",
      error: error.message,
    });
  }
};

// Delete card application (admin only)
exports.deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await CardApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await CardApplication.findByIdAndDelete(applicationId);

    res.status(200).json({
      message: "Application deleted successfully",
      deletedApplication: {
        id: application._id,
        name: application.name,
        email: application.email,
        status: application.status,
      },
    });
  } catch (error) {
    console.error("Delete application error:", error);
    res.status(500).json({
      message: "Failed to delete application",
      error: error.message,
    });
  }
};

// Create new admin (admin only)
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new admin user
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber: phoneNumber || "",
      role: "admin",
      isVerified: true, // Auto-verify admin users
      verification: undefined, // No verification needed
    });

    await newAdmin.save();

    // Send email with login credentials
    const emailResult = await sendNewAdminEmail(email, name, password);

    if (!emailResult.success) {
      console.error("Failed to send admin welcome email:", emailResult.error);
    }

    res.status(201).json({
      message: "Admin user created successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        phoneNumber: newAdmin.phoneNumber,
        role: newAdmin.role,
        isVerified: newAdmin.isVerified,
      },
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({
      message: "Failed to create admin user",
      error: error.message,
    });
  }
};


