const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }

    return data;
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
};

// Get single user by ID
export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user details');
    }

    return data;
  } catch (error) {
    console.error('Get user by ID error:', error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete user');
    }

    return data;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

// Update user role
export const updateUserRole = async (userId, role) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update user role');
    }

    return data;
  } catch (error) {
    console.error('Update user role error:', error);
    throw error;
  }
};

// Get all card applications
export const getAllApplications = async (status = 'all') => {
  try {
    const url = status && status !== 'all' 
      ? `${API_BASE_URL}/api/admin/applications?status=${status}`
      : `${API_BASE_URL}/api/admin/applications`;
      
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch applications');
    }

    return data;
  } catch (error) {
    console.error('Get all applications error:', error);
    throw error;
  }
};

// Approve card application
export const approveApplication = async (applicationId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/applications/${applicationId}/approve`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to approve application');
    }

    return data;
  } catch (error) {
    console.error('Approve application error:', error);
    throw error;
  }
};

// Reject card application
export const rejectApplication = async (applicationId, rejectionReason) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/applications/${applicationId}/reject`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rejectionReason }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to reject application');
    }

    return data;
  } catch (error) {
    console.error('Reject application error:', error);
    throw error;
  }
};

// Delete card application
export const deleteApplication = async (applicationId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/applications/${applicationId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete application');
    }

    return data;
  } catch (error) {
    console.error('Delete application error:', error);
    throw error;
  }
};

