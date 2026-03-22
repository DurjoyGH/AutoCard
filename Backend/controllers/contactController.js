const Contact = require("../models/Contact");
const User = require("../models/User");
const { Op } = require("sequelize");
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
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // Send confirmation email to user
    try {
      await sendContactConfirmationEmail(email, name, subject);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: "Your message has been sent successfully! We'll get back to you soon.",
      contactId: contact.id,
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

    const where = {};

    // Filter by status
    if (status && ["pending", "replied", "closed"].includes(status)) {
      where.status = status;
    }

    // Search by name, email, or subject
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { subject: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: contacts } = await Contact.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "repliedByUser",
          attributes: ["name", "email"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: skip,
    });

    // Get statistics
    const stats = {
      total: await Contact.count(),
      pending: await Contact.count({ where: { status: "pending" } }),
      replied: await Contact.count({ where: { status: "replied" } }),
      closed: await Contact.count({ where: { status: "closed" } }),
      unread: await Contact.count({ where: { isRead: false } }),
    };

    res.status(200).json({
      contacts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit)),
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

    if (!id) {
      return res.status(400).json({ message: "Contact ID is required" });
    }

    const contact = await Contact.findByPk(id, {
      include: [
        {
          model: User,
          as: "repliedByUser",
          attributes: ["name", "email", "role"],
          required: false,
        },
      ],
    });

    if (!contact) {
      return res.status(404).json({
        message: "Contact message not found",
      });
    }

    // Mark as read
    if (!contact.isRead) {
      await contact.update({ isRead: true });
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

    if (!id) {
      return res.status(400).json({ message: "Contact ID is required" });
    }

    if (!replyMessage || replyMessage.trim() === "") {
      return res.status(400).json({
        message: "Reply message is required",
      });
    }

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact message not found",
      });
    }

    // Update contact with reply
    await contact.update({
      replyMessage: replyMessage.trim(),
      repliedBy: adminId,
      repliedAt: new Date(),
      status: "replied",
      isRead: true,
    });

    // Reload with associations
    const updatedContact = await Contact.findByPk(id, {
      include: [
        {
          model: User,
          as: "repliedByUser",
          attributes: ["name", "email"],
          required: false,
        },
      ],
    });

    // Send reply email to user
    try {
      const admin = await User.findByPk(adminId);
      await sendContactReplyEmail(
        contact.email,
        contact.name,
        contact.subject,
        contact.message,
        replyMessage,
        admin.name
      );
    } catch (emailError) {
      console.error("Failed to send reply email:", emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({
      message: "Reply sent successfully",
      contact: updatedContact,
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

    if (!id) {
      return res.status(400).json({ message: "Contact ID is required" });
    }

    if (!status || !["pending", "replied", "closed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be: pending, replied, or closed",
      });
    }

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({
        message: "Contact message not found",
      });
    }

    await contact.update({ status });

    const updatedContact = await Contact.findByPk(id, {
      include: [
        {
          model: User,
          as: "repliedByUser",
          attributes: ["name", "email"],
          required: false,
        },
      ],
    });

    res.status(200).json({
      message: "Status updated successfully",
      contact: updatedContact,
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

    if (!id) {
      return res.status(400).json({ message: "Contact ID is required" });
    }

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact message not found",
      });
    }

    await contact.destroy();

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

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact message not found",
      });
    }

    await contact.update({ isRead: isRead !== undefined ? isRead : true });

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
