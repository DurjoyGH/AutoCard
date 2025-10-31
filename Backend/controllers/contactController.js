const Contact = require("../models/contact");
const { sendContactConfirmationEmail, sendContactReplyEmail } = require("../services/email");

// Submit contact form (Public - No auth required)
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    // Create contact message
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    await contact.save();

    // Send confirmation email to user
    try {
      await sendContactConfirmationEmail(email, name, subject);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: "Your message has been sent successfully! We'll get back to you soon.",
      contactId: contact._id,
    });
  } catch (error) {
    console.error("Submit contact form error:", error);
    res.status(500).json({
      message: "Failed to submit contact form",
      error: error.message,
    });
  }
};

// Get all contact messages (Admin only)
exports.getAllContacts = async (req, res) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;

    const query = {};

    // Filter by status
    if (status && ["pending", "replied", "closed"].includes(status)) {
      query.status = status;
    }

    // Search by name, email, or subject
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const contacts = await Contact.find(query)
      .populate("reply.repliedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Contact.countDocuments(query);

    // Get statistics
    const stats = {
      total: await Contact.countDocuments(),
      pending: await Contact.countDocuments({ status: "pending" }),
      replied: await Contact.countDocuments({ status: "replied" }),
      closed: await Contact.countDocuments({ status: "closed" }),
      unread: await Contact.countDocuments({ isRead: false }),
    };

    res.status(200).json({
      contacts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      stats,
    });
  } catch (error) {
    console.error("Get all contacts error:", error);
    res.status(500).json({
      message: "Failed to fetch contacts",
      error: error.message,
    });
  }
};

// Get single contact message (Admin only)
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id).populate(
      "reply.repliedBy",
      "name email role"
    );

    if (!contact) {
      return res.status(404).json({
        message: "Contact message not found",
      });
    }

    // Mark as read
    if (!contact.isRead) {
      contact.isRead = true;
      await contact.save();
    }

    res.status(200).json({
      contact,
    });
  } catch (error) {
    console.error("Get contact by ID error:", error);
    res.status(500).json({
      message: "Failed to fetch contact",
      error: error.message,
    });
  }
};

// Reply to contact message (Admin only)
exports.replyToContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;
    const adminId = req.user.id;

    if (!replyMessage || replyMessage.trim() === "") {
      return res.status(400).json({
        message: "Reply message is required",
      });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact message not found",
      });
    }

    // Update contact with reply
    contact.reply = {
      message: replyMessage.trim(),
      repliedBy: adminId,
      repliedAt: new Date(),
    };
    contact.status = "replied";
    contact.isRead = true;

    await contact.save();

    // Populate reply details
    await contact.populate("reply.repliedBy", "name email");

    // Send reply email to user
    try {
      await sendContactReplyEmail(
        contact.email,
        contact.name,
        contact.subject,
        contact.message,
        replyMessage,
        contact.reply.repliedBy.name
      );
    } catch (emailError) {
      console.error("Failed to send reply email:", emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({
      message: "Reply sent successfully",
      contact,
    });
  } catch (error) {
    console.error("Reply to contact error:", error);
    res.status(500).json({
      message: "Failed to send reply",
      error: error.message,
    });
  }
};

// Update contact status (Admin only)
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["pending", "replied", "closed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be: pending, replied, or closed",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("reply.repliedBy", "name email");

    if (!contact) {
      return res.status(404).json({
        message: "Contact message not found",
      });
    }

    res.status(200).json({
      message: "Status updated successfully",
      contact,
    });
  } catch (error) {
    console.error("Update contact status error:", error);
    res.status(500).json({
      message: "Failed to update status",
      error: error.message,
    });
  }
};

// Delete contact message (Admin only)
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact message not found",
      });
    }

    res.status(200).json({
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact error:", error);
    res.status(500).json({
      message: "Failed to delete contact",
      error: error.message,
    });
  }
};

// Mark as read/unread (Admin only)
exports.toggleReadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      id,
      { isRead: isRead !== undefined ? isRead : true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        message: "Contact message not found",
      });
    }

    res.status(200).json({
      message: `Marked as ${contact.isRead ? "read" : "unread"}`,
      contact,
    });
  } catch (error) {
    console.error("Toggle read status error:", error);
    res.status(500).json({
      message: "Failed to update read status",
      error: error.message,
    });
  }
};
