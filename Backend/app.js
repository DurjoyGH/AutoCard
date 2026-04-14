require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { swaggerConfig, swaggerUIOptions } = require("./configs/swagger");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const applyRoutes = require("./routes/applyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");
const scanRoutes = require("./routes/scanRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const PaymentDetail = require("./models/PaymentDetail");

const app = express();

const swaggerSpec = swaggerJsdoc(swaggerConfig);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUIOptions),
);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://auto-card-just.vercel.app",
  "https://auto-card-backend.vercel.app",
  "https://auto-card-backend.vercel.app/api",
  "https://sandbox.sslcommerz.com",
  "https://securepay.sslcommerz.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin === "null") return callback(null, true);

    const isExactMatch = allowedOrigins.includes(origin);
    const isVercelPreview = /^https:\/\/auto-card-[a-z0-9-]+\.vercel\.app$/.test(origin);
    const isSSLCommerz = /^https:\/\/([a-z0-9-]+\.)?sslcommerz\.com(?::\d+)?$/.test(origin);
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(?::\d+)?$/.test(origin);

    if (isExactMatch || isVercelPreview || isSSLCommerz || isLocalhost) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/apply", applyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("API is Running!");
});

app.post("/payment/success", async (req, res) => {
  try {
    const transactionId = req.body.tran_id;

    if (transactionId) {
      await PaymentDetail.update(
        {
          status: "completed",
          paidAt: new Date(),
          gatewayResponse: req.body,
        },
        { where: { transactionId } }
      );
    }

    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/profile`);
  } catch (error) {
    console.error("Payment success callback error:", error);
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/profile`);
  }
});

app.post("/payment/fail", async (req, res) => {
  try {
    const transactionId = req.body.tran_id;
    if (transactionId) {
      await PaymentDetail.update(
        { status: "failed", gatewayResponse: req.body },
        { where: { transactionId } }
      );
    }
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/profile`);
  } catch (error) {
    console.error("Payment fail callback error:", error);
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/profile`);
  }
});

app.post("/payment/cancel", async (req, res) => {
  try {
    const transactionId = req.body.tran_id;
    if (transactionId) {
      await PaymentDetail.update(
        { status: "cancelled", gatewayResponse: req.body },
        { where: { transactionId } }
      );
    }
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/profile`);
  } catch (error) {
    console.error("Payment cancel callback error:", error);
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/profile`);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

module.exports = app;
