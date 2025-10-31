const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Submit contact form (No auth required)
export const submitContactForm = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit contact form');
    }

    return data;
  } catch (error) {
    console.error('Submit contact form error:', error);
    throw error;
  }
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Get all contact messages (Admin only)
export const getAllContacts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.page) queryParams.append('page', params.page);

    const response = await fetch(
      `${API_BASE_URL}/api/contact?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch contacts');
    }

    return data;
  } catch (error) {
    console.error('Get all contacts error:', error);
    throw error;
  }
};

// Get single contact message (Admin only)
export const getContactById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch contact');
    }

    return data;
  } catch (error) {
    console.error('Get contact by ID error:', error);
    throw error;
  }
};

// Reply to contact message (Admin only)
export const replyToContact = async (id, replyMessage) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact/${id}/reply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ replyMessage }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send reply');
    }

    return data;
  } catch (error) {
    console.error('Reply to contact error:', error);
    throw error;
  }
};

// Update contact status (Admin only)
export const updateContactStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update status');
    }

    return data;
  } catch (error) {
    console.error('Update contact status error:', error);
    throw error;
  }
};

// Toggle read/unread status (Admin only)
export const toggleContactReadStatus = async (id, isRead) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isRead }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update read status');
    }

    return data;
  } catch (error) {
    console.error('Toggle read status error:', error);
    throw error;
  }
};

// Delete contact message (Admin only)
export const deleteContact = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete contact');
    }

    return data;
  } catch (error) {
    console.error('Delete contact error:', error);
    throw error;
  }
};
