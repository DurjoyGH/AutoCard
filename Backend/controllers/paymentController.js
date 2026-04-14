const crypto = require("crypto");
const SSLCommerzPayment = require("sslcommerz-lts");
const User = require("../models/User");
const CardApplication = require("../models/CardApplication");
const PaymentDetail = require("../models/PaymentDetail");

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = false;

exports.makePayment = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { cardApplicationId } = req.body;
    if (!cardApplicationId) {
      return res.status(400).json({ error: "cardApplicationId is required" });
    }

    const application = await CardApplication.findOne({
      where: { id: cardApplicationId, userId: req.user.id },
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.status !== "approved") {
      return res.status(400).json({
        error: "Payment is available only after admin approval",
      });
    }

    const completedPayment = await PaymentDetail.findOne({
      where: {
        cardApplicationId,
        userId: req.user.id,
        status: "completed",
      },
    });

    if (completedPayment) {
      return res.status(400).json({ error: "Payment already completed" });
    }

    const transactionId = `txn_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
    const amount = 100;

    await PaymentDetail.create({
      userId: req.user.id,
      cardApplicationId,
      transactionId,
      amount,
      currency: "BDT",
      status: "pending",
    });

    const data = {
      total_amount: amount,
      currency: "BDT",
      tran_id: transactionId,
      success_url: `${process.env.BACKEND_URL || "http://localhost:3000"}/payment/success`,
      fail_url: `${process.env.BACKEND_URL || "http://localhost:3000"}/payment/fail`,
      cancel_url: `${process.env.BACKEND_URL || "http://localhost:3000"}/payment/cancel`,
      shipping_method: "NO",
      product_name: "Library Card",
      product_category: "Service",
      product_profile: "general",
      cus_name: user.name,
      ship_name: user.name,
      ship_add1: user.district || "Jashore",
      ship_city: "Jashore",
      ship_state: "Jashore",
      ship_postcode: 7408,
      ship_country: "Bangladesh",
      cus_email: user.email,
      cus_add1: user.district || "Jashore",
      cus_country: "Bangladesh",
      cus_phone: user.phoneNumber || "01700000000",
      value_a: cardApplicationId,
      value_b: req.user.id,
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    sslcz
      .init(data)
      .then(async (apiResponse) => {
        const gatewayUrl = apiResponse.GatewayPageURL;

        await PaymentDetail.update(
          { gatewayResponse: apiResponse },
          { where: { transactionId } }
        );

        if (gatewayUrl) {
          return res.json({ success: true, url: gatewayUrl });
        }

        return res
          .status(400)
          .json({ error: "Failed to generate payment gateway URL" });
      })
      .catch(async (error) => {
        await PaymentDetail.update(
          { status: "failed", gatewayResponse: { error: error.message } },
          { where: { transactionId } }
        );

        console.error("SSLCommerz Error:", error);
        return res.status(500).json({ error: "Payment initiation failed" });
      });
  } catch (error) {
    console.error("Payment Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMyPaymentStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const payment = await PaymentDetail.findOne({
      where: {
        userId: req.user.id,
        cardApplicationId: applicationId,
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      hasPayment: !!payment,
      paymentStatus: payment ? payment.status : "unpaid",
      payment,
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    return res.status(500).json({ error: "Failed to get payment status" });
  }
};
