const express = require("express");
const router = express.Router();
const applyController = require("../controllers/applyController");
const { authenticateToken } = require("../middlewares/auth");

// Apply for library card
router.post("/apply", authenticateToken, applyController.applyForCard);

// Get application status
router.get("/status", authenticateToken, applyController.getApplicationStatus);

module.exports = router;
