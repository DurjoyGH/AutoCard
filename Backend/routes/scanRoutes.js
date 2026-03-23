const express = require("express");
const router = express.Router();
const scanController = require("../controllers/scanController");

// Get card details by ID (public route - no authentication required)
router.get("/card/:cardId", scanController.getCardDetails);

module.exports = router;
