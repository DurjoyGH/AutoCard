const User = require('../models/user');
const cloudinary = require('../configs/cloudinary');

// Helper function to upload file to Cloudinary
const uploadToCloudinary = async (fileBuffer, folder, publicId = null) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: `AutoCard/${folder}`,
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'limit' },
        { quality: 'auto' }
      ]
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
      uploadOptions.overwrite = true;
    }

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(fileBuffer);
  });
};

// Helper function to delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -verification');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      name,
      studentID,
      hallName,
      phoneNumber,
      emergencyPhoneNumber,
      district,
      bloodGroup
    } = req.body;

    // Find the current user
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (studentID) updateData.studentID = studentID;
    if (hallName) updateData.hallName = hallName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (emergencyPhoneNumber) updateData.emergencyPhoneNumber = emergencyPhoneNumber;
    if (district) updateData.district = district;
    if (bloodGroup) updateData.bloodGroup = bloodGroup;

    // Handle profile picture upload
    if (req.files && req.files.profilePicture) {
      try {
        // Delete old profile picture if exists
        if (currentUser.profilePicture) {
          const oldPublicId = currentUser.profilePicture.split('/').pop().split('.')[0];
          const fullPublicId = `AutoCard/UserPhoto/${oldPublicId}`;
          await deleteFromCloudinary(fullPublicId);
        }

        // Upload new profile picture
        const profileResult = await uploadToCloudinary(
          req.files.profilePicture[0].buffer,
          'UserPhoto',
          `user_${userId}_profile_${Date.now()}`
        );
        updateData.profilePicture = profileResult.secure_url;
      } catch (uploadError) {
        console.error('Profile picture upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload profile picture'
        });
      }
    }

    // Handle signature upload
    if (req.files && req.files.signature) {
      try {
        // Delete old signature if exists
        if (currentUser.signature) {
          const oldPublicId = currentUser.signature.split('/').pop().split('.')[0];
          const fullPublicId = `AutoCard/UserSignature/${oldPublicId}`;
          await deleteFromCloudinary(fullPublicId);
        }

        // Upload new signature
        const signatureResult = await uploadToCloudinary(
          req.files.signature[0].buffer,
          'UserSignature',
          `user_${userId}_signature_${Date.now()}`
        );
        updateData.signature = signatureResult.secure_url;
      } catch (uploadError) {
        console.error('Signature upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload signature'
        });
      }
    }

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -verification');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email or Student ID already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete profile picture
const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.profilePicture) {
      return res.status(400).json({
        success: false,
        message: 'No profile picture to delete'
      });
    }

    // Delete from Cloudinary
    const publicId = user.profilePicture.split('/').pop().split('.')[0];
    const fullPublicId = `AutoCard/UserPhoto/${publicId}`;
    await deleteFromCloudinary(fullPublicId);

    // Remove from database
    await User.findByIdAndUpdate(userId, { $unset: { profilePicture: 1 } });

    res.status(200).json({
      success: true,
      message: 'Profile picture deleted successfully'
    });

  } catch (error) {
    console.error('Delete profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete signature
const deleteSignature = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.signature) {
      return res.status(400).json({
        success: false,
        message: 'No signature to delete'
      });
    }

    // Delete from Cloudinary
    const publicId = user.signature.split('/').pop().split('.')[0];
    const fullPublicId = `AutoCard/UserSignature/${publicId}`;
    await deleteFromCloudinary(fullPublicId);

    // Remove from database
    await User.findByIdAndUpdate(userId, { $unset: { signature: 1 } });

    res.status(200).json({
      success: true,
      message: 'Signature deleted successfully'
    });

  } catch (error) {
    console.error('Delete signature error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteProfilePicture,
  deleteSignature
};
