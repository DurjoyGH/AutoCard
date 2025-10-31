const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Apply for library card
export const applyForCard = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/apply/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit application');
    }

    return data;
  } catch (error) {
    console.error('Apply for card error:', error);
    throw error;
  }
};

// Get application status
export const getApplicationStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/apply/status`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get application status');
    }

    return data;
  } catch (error) {
    console.error('Get application status error:', error);
    throw error;
  }
};
