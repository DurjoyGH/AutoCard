import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLayout from './components/Layout/UserLayout';
import AdminLayout from './components/Layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import Contact from './pages/user/Contact';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserList from './pages/admin/UserList';
import ReviewCardApplication from './pages/admin/ReviewCardApplication';
import AddAdmin from './pages/admin/AddAdmin';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOTP from './pages/auth/VerifyOTP';
import CustomToast from './components/Toast/CustomToast';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <CustomToast />
        <Routes>
        {/* Public Routes - Home page and contact accessible to everyone */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        
        {/* User Routes - Protected for regular users */}
        <Route path="/" element={
          <ProtectedRoute requiredRole="user">
            <UserLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
        
        {/* Admin Routes - Protected for admin users */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="applications" element={<ReviewCardApplication />} />
          <Route path="add-admin" element={<AddAdmin />} />
        </Route>
        
        {/* Auth Routes (without layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        
        {/* 404 Route */}
        <Route path="*" element={<div className="p-8 text-white min-h-screen bg-[#01161e] flex items-center justify-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
