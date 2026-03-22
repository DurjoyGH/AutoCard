const express = require('express')
const { register, login, verifyUser, resendVerificationToken, refreshToken, getUserRole } = require('../controllers/authController')
const { authenticateToken, requireAdmin, requireRole } = require('../middlewares/auth')
const User = require('../models/User')

const router = express.Router()

/**
 * @swagger
 * /api/auth/all:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all registered users (passwords excluded for security)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             example:
 *               - _id: "64f8a1b2c3d4e5f6789012ab"
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *               - _id: "64f8a1b2c3d4e5f6789012ac"
 *                 name: "Jane Smith"
 *                 email: "jane.smith@example.com"
 *                 createdAt: "2024-01-16T09:15:00.000Z"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch users"
 *                 error:
 *                   type: string
 *                   example: "Database connection error"
 */
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     descripti// In production, send this via emailon: Create a new user account with name, email, and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User already exists"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/register", register)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/login", login)

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Verify user account
 *     description: Verify user account using the verification token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, verificationToken]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64f8a1b2c3d4e5f6789012ab"
 *               verificationToken:
 *                 type: string
 *                 example: "58492"
 *     responses:
 *       200:
 *         description: Account verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account verified successfully!"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Verification failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid verification token!"
 *       500:
 *         description: Server error
 */
router.post("/verify", verifyUser)

/**
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     summary: Resend verification token
 *     description: Generate and send a new verification token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: New verification token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "New verification token generated!"
 *                 verificationToken:
 *                   type: string
 *                   example: "58492"
 *                 userId:
 *                   type: string
 *                   example: "64f8a1b2c3d4e5f6789012ab"
 *       400:
 *         description: Error generating token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User is already verified!"
 *       500:
 *         description: Server error
 */
router.post("/resend-verification", resendVerificationToken)

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: Get authenticated user's profile information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile retrieved successfully!"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access token required!"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired token!"
 */
router.get("/profile", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Profile retrieved successfully!",
    user: req.user
  });
})

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh JWT token
 *     description: Generate a new JWT token using refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token refreshed successfully!"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 role:
 *                   type: string
 *                   example: "user"
 *       401:
 *         description: Unauthorized
 */
router.post("/refresh-token", refreshToken)

/**
 * @swagger
 * /api/auth/role:
 *   get:
 *     summary: Get user role and permissions
 *     description: Get authenticated user's role information and permissions
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role information retrieved successfully!"
 *                 role:
 *                   type: string
 *                   example: "admin"
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["view_all_users", "manage_users", "approve_applications"]
 *                 redirectTo:
 *                   type: string
 *                   example: "/admin/dashboard"
 *       401:
 *         description: Unauthorized
 */
router.get("/role", authenticateToken, getUserRole)

/**
 * @swagger
 * /api/auth/admin-only:
 *   get:
 *     summary: Admin only endpoint (example)
 *     description: Example endpoint that requires admin role
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin access granted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin access granted!"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/admin-only", authenticateToken, requireAdmin, (req, res) => {
  res.status(200).json({
    message: "Admin access granted!",
    user: req.user,
    adminFeatures: [
      "User Management",
      "Application Approval",
      "System Reports",
      "Settings Configuration"
    ]
  });
})

module.exports = router