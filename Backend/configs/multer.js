const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (files will be uploaded to Cloudinary)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Middleware for uploading profile picture and signature
const uploadProfileFiles = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]);

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: 'File too large. Maximum size is 5MB.' 
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        success: false, 
        message: 'Too many files or unexpected field name.' 
      });
    }
  }
  
  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({ 
      success: false, 
      message: 'Only image files are allowed!' 
    });
  }
  
  next(err);
};

module.exports = {
  uploadProfileFiles,
  handleMulterError
};
