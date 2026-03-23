const CardApplication = require("../models/CardApplication");
const User = require("../models/User");

// Get card details by application ID (for QR code scanning)
exports.getCardDetails = async (req, res) => {
  try {
    const { cardId } = req.params;

    if (!cardId) {
      return res.status(400).json({ message: "Card ID is required" });
    }

    const application = await CardApplication.findByPk(cardId, {
      include: [
        {
          model: User,
          as: "applicant",
          attributes: [
            "id",
            "name",
            "email",
            "studentID",
            "phoneNumber",
          ],
        },
        {
          model: User,
          as: "reviewer",
          attributes: ["name", "email"],
        },
      ],
    });

    if (!application) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Only show details if card is approved
    if (application.status !== "approved") {
      return res.status(403).json({
        message: "This card is not approved yet",
        status: application.status,
      });
    }

    res.status(200).json({
      message: "Card details retrieved successfully",
      card: {
        id: application.id,
        name: application.name,
        email: application.email,
        studentID: application.studentID,
        department: application.department,
        hallName: application.hallName,
        phoneNumber: application.phoneNumber,
        emergencyPhoneNumber: application.emergencyPhoneNumber,
        district: application.district,
        bloodGroup: application.bloodGroup,
        profilePicture: application.profilePicture,
        signature: application.signature,
        status: application.status,
        appliedAt: application.appliedAt,
        reviewedAt: application.reviewedAt,
        approvedBy: application.reviewer ? application.reviewer.name : "System",
        applicantId: application.applicant ? application.applicant.id : null,
      },
    });
  } catch (error) {
    console.error("Get card details error:", error);
    res.status(500).json({
      message: "Failed to retrieve card details",
      error: error.message,
    });
  }
};
