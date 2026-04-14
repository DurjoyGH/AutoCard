const CardApplication = require("../models/CardApplication");
const User = require("../models/User");
const PaymentDetail = require("../models/PaymentDetail");

// Apply for library card
exports.applyForCard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if profile is complete
    const requiredFields = [
      "name",
      "studentID",
      "department",
      "hallName",
      "phoneNumber",
      "emergencyPhoneNumber",
      "district",
      "bloodGroup",
      "profilePicture",
      "signature",
    ];

    const missingFields = requiredFields.filter((field) => !user[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Profile is incomplete. Please complete your profile first.",
        missingFields,
      });
    }

    // Check if user already has an application
    const existingApplication = await CardApplication.findOne({ where: { userId } });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for a library card",
        application: existingApplication,
      });
    }

    // Create new application with user's data
    const application = await CardApplication.create({
      userId: user.id,
      name: user.name,
      email: user.email,
      studentID: user.studentID,
      department: user.department,
      hallName: user.hallName,
      phoneNumber: user.phoneNumber,
      emergencyPhoneNumber: user.emergencyPhoneNumber,
      district: user.district,
      bloodGroup: user.bloodGroup,
      profilePicture: user.profilePicture,
      signature: user.signature,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Apply for card error:", error);
    res.status(500).json({
      message: "Failed to submit application",
      error: error.message,
    });
  }
};

// Get application status
exports.getApplicationStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const application = await CardApplication.findOne({ where: { userId } });

    if (!application) {
      return res.status(404).json({
        message: "No application found",
        hasApplication: false,
      });
    }

    const latestPayment = await PaymentDetail.findOne({
      where: {
        userId,
        cardApplicationId: application.id,
      },
      order: [["createdAt", "DESC"]],
    });

    const isPaymentDone = latestPayment?.status === "completed";

    res.status(200).json({
      hasApplication: true,
      application,
      isPaymentDone,
      paymentStatus: latestPayment?.status || "unpaid",
      payment: latestPayment || null,
      canDownloadCard: application.status === "approved" && isPaymentDone,
    });
  } catch (error) {
    console.error("Get application status error:", error);
    res.status(500).json({
      message: "Failed to get application status",
      error: error.message,
    });
  }
};
