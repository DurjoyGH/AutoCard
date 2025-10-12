import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLayout from './components/Layout/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
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
        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="dashboard" element={<UserDashboard />} />
          {/* Add more user routes here as needed */}
          <Route path="profile" element={<UserProfile />} />
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
