const User = require("../models/User");
const CardApplication = require("../models/CardApplication");
const bcrypt = require("bcrypt");
const {
  sendApplicationApprovedEmail,
  sendApplicationRejectedEmail,
  sendNewAdminEmail,
} = require("../services/email");
const { Op } = require("sequelize");

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Exclude password field and get all users except the requesting admin
    const users = await User.findAll({
      where: { id: { [Op.ne]: req.user.id } },
      attributes: { exclude: ['password', 'verificationToken', 'verificationTokenCreatedAt', 'verificationTokenExpiresAt'] },
      order: [["createdAt", "DESC"]],
    });

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

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'verificationToken', 'verificationTokenCreatedAt', 'verificationTokenExpiresAt'] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's application if exists
    const application = await CardApplication.findOne({ where: { userId: user.id } });

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
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting own account
    if (user.id === req.user.id) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    // Delete user's application if exists
    await CardApplication.destroy({ where: { userId: user.id } });

    // Delete the user
    await user.destroy();

    res.status(200).json({
      message: "User deleted successfully",
      deletedUser: {
        id: user.id,
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

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent changing own role
    if (user.id === req.user.id) {
      return res.status(400).json({
        message: "You cannot change your own role",
      });
    }

    await user.update({ role });

    res.status(200).json({
      message: `User role updated to ${role} successfully`,
      user: {
        id: user.id,
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

    const where = status && status !== "all" ? { status } : {};

    const applications = await CardApplication.findAll({
      where,
      include: [
        {
          model: User,
          as: "applicant",
          attributes: ["name", "email", "studentID", "phoneNumber"],
          required: false,
        },
        {
          model: User,
          as: "reviewer",
          attributes: ["name", "email"],
          required: false,
        },
      ],
      order: [["appliedAt", "DESC"]],
    });

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

    const application = await CardApplication.findByPk(applicationId, {
      include: [
        {
          model: User,
          as: "applicant",
          attributes: ["name", "email"],
          required: false,
        },
      ],
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status === "approved") {
      return res.status(400).json({
        message: "Application is already approved",
      });
    }

    await application.update({
      status: "approved",
      reviewedAt: new Date(),
      reviewedBy: req.user.id,
      rejectionReason: null,
    });

    // Send approval email to user
    const emailResult = await sendApplicationApprovedEmail(
      application.User.email,
      application.User.name,
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

    const application = await CardApplication.findByPk(applicationId, {
      include: [
        {
          model: User,
          as: "applicant",
          attributes: ["name", "email"],
          required: false,
        },
      ],
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status === "rejected") {
      return res.status(400).json({
        message: "Application is already rejected",
      });
    }

    await application.update({
      status: "rejected",
      reviewedAt: new Date(),
      reviewedBy: req.user.id,
      rejectionReason: rejectionReason,
    });

    // Send rejection email to user
    const emailResult = await sendApplicationRejectedEmail(
      application.User.email,
      application.User.name,
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

    const application = await CardApplication.findByPk(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await application.destroy();

    res.status(200).json({
      message: "Application deleted successfully",
      deletedApplication: {
        id: application.id,
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
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new admin user
    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber: phoneNumber || "",
      role: "admin",
      isVerified: true, // Auto-verify admin users
    });

    // Send email with login credentials
    const emailResult = await sendNewAdminEmail(email, name, password);

    if (!emailResult.success) {
      console.error("Failed to send admin welcome email:", emailResult.error);
    }

    res.status(201).json({
      message: "Admin user created successfully",
      admin: {
        id: newAdmin.id,
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


