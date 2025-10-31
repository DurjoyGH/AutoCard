import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../Toast/CustomToast';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      showToast.error('Please login to access this page');
    }
  }, [isLoading, isAuthenticated]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#01161e] via-[#124559] to-[#01161e]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#598392] mx-auto mb-4"></div>
          <p className="text-[#598392] text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on user's actual role
    const redirectPath = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
    setTimeout(() => {
      showToast.error(`Access denied. You don't have ${requiredRole} privileges.`);
    }, 100);
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
