const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticateToken, isAdmin } = require("../middlewares/auth");

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(isAdmin);

// Get all users
router.get("/users", adminController.getAllUsers);

// Get single user by ID
router.get("/users/:userId", adminController.getUserById);

// Delete user
router.delete("/users/:userId", adminController.deleteUser);

// Update user role
router.put("/users/:userId/role", adminController.updateUserRole);

// Get all card applications
router.get("/applications", adminController.getAllApplications);

// Approve card application
router.put("/applications/:applicationId/approve", adminController.approveApplication);

// Reject card application
router.put("/applications/:applicationId/reject", adminController.rejectApplication);

// Delete card application
router.delete("/applications/:applicationId", adminController.deleteApplication);

module.exports = router;
