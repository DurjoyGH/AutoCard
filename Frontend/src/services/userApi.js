const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
  };
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    return data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

// Update user profile (with files)
export const updateUserProfile = async (profileData, files = {}) => {
  try {
    const formData = new FormData();

    // Append text fields
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== undefined && profileData[key] !== null && profileData[key] !== '') {
        formData.append(key, profileData[key]);
      }
    });

    // Append files
    if (files.profilePicture) {
      formData.append('profilePicture', files.profilePicture);
    }
    if (files.signature) {
      formData.append('signature', files.signature);
    }

    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        // Don't set Content-Type header, let browser set it for FormData
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Delete profile picture
export const deleteProfilePicture = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/profile/picture`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete profile picture');
    }

    return data;
  } catch (error) {
    console.error('Delete profile picture error:', error);
    throw error;
  }
};

// Delete signature
export const deleteSignature = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/profile/signature`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete signature');
    }

    return data;
  } catch (error) {
    console.error('Delete signature error:', error);
    throw error;
  }
};
