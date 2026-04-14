const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/auth");
const {
  makePayment,
  getMyPaymentStatus,
} = require("../controllers/paymentController");

router.post("/make", authenticateToken, makePayment);
router.get("/status/:applicationId", authenticateToken, getMyPaymentStatus);

module.exports = router;
