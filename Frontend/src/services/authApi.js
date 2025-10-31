const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// API endpoints
const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  VERIFY: `${API_BASE_URL}/api/auth/verify`,
  RESEND_VERIFICATION: `${API_BASE_URL}/api/auth/resend-verification`,
  PROFILE: `${API_BASE_URL}/api/auth/profile`,
  REFRESH_TOKEN: `${API_BASE_URL}/api/auth/refresh-token`,
  ROLE: `${API_BASE_URL}/api/auth/role`,
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Authentication API functions
export const authApi = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: userData.fullName,
          email: userData.email,
          password: userData.password,
        }),
      });

      const data = await handleResponse(response);
      
      // Don't store token for unverified users - they need to verify first
      // The token will be stored after successful verification
      // if (data.token) {
      //   localStorage.setItem('token', data.token);
      //   localStorage.setItem('user', JSON.stringify(data.user));
      // }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await handleResponse(response);
      
      // Store token and user data if login is successful
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Verify user account
  verify: async (verificationData) => {
    try {
      const response = await fetch(API_ENDPOINTS.VERIFY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(verificationData),
      });

      const data = await handleResponse(response);
      
      // Store token and user data after successful verification
      if (data.user) {
        // Store token if provided, otherwise create a placeholder
        const token = data.token || 'verified-user-token';
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  },

  // Resend verification token
  resendVerification: async (email) => {
    try {
      const response = await fetch(API_ENDPOINTS.RESEND_VERIFICATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PROFILE, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    try {
      const response = await fetch(API_ENDPOINTS.REFRESH_TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ refreshToken }),
      });

      const data = await handleResponse(response);
      
      // Update stored token if refresh is successful
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },

  // Get user role
  getUserRole: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ROLE, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Get user role error:', error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Optionally call backend logout endpoint if it exists
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get current token
  getToken: () => {
    return localStorage.getItem('token');
  },
};

export default authApi;