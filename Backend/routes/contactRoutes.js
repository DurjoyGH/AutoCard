const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const { authenticateToken, isAdmin } = require("../middlewares/auth");

// Public route - Anyone can submit contact form
router.post("/submit", contactController.submitContactForm);

// Admin routes - Require authentication and admin role
router.get(
  "/",
  authenticateToken,
  isAdmin,
  contactController.getAllContacts
);

router.get(
  "/:id",
  authenticateToken,
  isAdmin,
  contactController.getContactById
);

router.post(
  "/:id/reply",
  authenticateToken,
  isAdmin,
  contactController.replyToContact
);

router.put(
  "/:id/status",
  authenticateToken,
  isAdmin,
  contactController.updateContactStatus
);

router.put(
  "/:id/read",
  authenticateToken,
  isAdmin,
  contactController.toggleReadStatus
);

router.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  contactController.deleteContact
);

module.exports = router;
