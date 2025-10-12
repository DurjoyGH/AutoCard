const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  deleteProfilePicture,
  deleteSignature
} = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/auth');
const { uploadProfileFiles, handleMulterError } = require('../configs/multer');

// All routes require authentication
router.use(authenticateToken);

// Get user profile
router.get('/profile', getUserProfile);

// Update user profile (with file uploads)
router.put('/profile', uploadProfileFiles, handleMulterError, updateUserProfile);

// Delete profile picture
router.delete('/profile/picture', deleteProfilePicture);

// Delete signature
router.delete('/profile/signature', deleteSignature);

module.exports = router;
