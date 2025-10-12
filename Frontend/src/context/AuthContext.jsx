import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      const isAuth = authApi.isAuthenticated();
      const currentUser = authApi.getCurrentUser();
      
      if (isAuth && currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        
        // Optionally verify token with backend
        try {
          const profileData = await authApi.getProfile();
          if (profileData.user) {
            setUser(profileData.user);
          }
        } catch (error) {
          // If token is invalid, clear auth state
          if (error.message.includes('401') || error.message.includes('403')) {
            await logout();
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);
      
      if (response.user && response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
      }
    } catch (error) {
      console.error('Login error in context:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authApi.register(userData);
      
      // For registration, user is not immediately logged in
      // They need to verify their account first
      return response;
    } catch (error) {
      console.error('Register error in context:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify account function
  const verifyAccount = async (verificationData) => {
    try {
      setIsLoading(true);
      const response = await authApi.verify(verificationData);
      
      // After successful verification, user is logged in
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      
      return response;
    } catch (error) {
      console.error('Verification error in context:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
      
      // Optional: Call backend logout endpoint if it exists
      // await authApi.logoutBackend();
    } catch (error) {
      console.error('Logout error in context:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
    
    // Update localStorage as well
    localStorage.setItem('user', JSON.stringify({
      ...user,
      ...userData
    }));
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin');
  };

  // Get user's full name
  const getUserName = () => {
    return user?.name || user?.fullName || 'User';
  };

  // Get user's email
  const getUserEmail = () => {
    return user?.email || '';
  };

  // Refresh user token
  const refreshToken = async () => {
    try {
      const refreshTokenFromStorage = localStorage.getItem('refreshToken');
      if (refreshTokenFromStorage) {
        const response = await authApi.refreshToken(refreshTokenFromStorage);
        if (response.token) {
          return response;
        }
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  };

  // Context value
  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    
    // Actions
    login,
    register,
    logout,
    verifyAccount,
    updateUser,
    refreshToken,
    initializeAuth,
    
    // Utilities
    hasRole,
    isAdmin,
    getUserName,
    getUserEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;