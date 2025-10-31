import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../Navigation/AdminSidebar';
import { Menu, LogOut, User } from 'lucide-react';
import { showToast } from '../Toast/CustomToast';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#01161e] via-[#124559] to-[#01161e] flex overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-[#01161e]/50 backdrop-blur-xl border-b border-[#598392]/20 flex-shrink-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            {/* Left side - Menu button for mobile */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-[#598392] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#598392]/10"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Center - Title (hidden on mobile) */}
            <h1 className="hidden lg:block text-white text-xl font-bold">
              Admin Dashboard
            </h1>

            {/* Right side - User info */}
            <div className="flex items-center space-x-4 ml-auto">
              {/* User Info */}
              <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-[#598392]/10 rounded-xl border border-[#598392]/20">
                <div className="w-8 h-8 bg-gradient-to-br from-[#598392] to-[#124559] rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">{user?.name || 'Admin'}</p>
                  <p className="text-[#598392]/70 text-xs capitalize">{user?.role || 'admin'}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all duration-200 border border-red-500/20"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
