import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  UserPlus,
  Home,
  Menu,
  X,
  MessageSquare
} from 'lucide-react';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: 'User List',
      path: '/admin/users',
      icon: <Users className="w-5 h-5" />
    },
    {
      name: 'Review Card Application',
      path: '/admin/applications',
      icon: <FileText className="w-5 h-5" />
    },
    {
      name: 'User Messages',
      path: '/admin/messages',
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      name: 'Add Admin',
      path: '/admin/add-admin',
      icon: <UserPlus className="w-5 h-5" />
    },
    {
      name: 'Go to Home',
      path: '/',
      icon: <Home className="w-5 h-5" />
    }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[#01161e]/95 backdrop-blur-xl 
          border-r border-[#598392]/20 z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-0 flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#598392]/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#598392] to-[#124559] rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Admin Panel</h2>
              <p className="text-[#598392]/70 text-xs">Management System</p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-[#598392] hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                // Close sidebar on mobile after clicking
                if (window.innerWidth < 1024) {
                  toggleSidebar();
                }
              }}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-[#598392] to-[#124559] text-white shadow-lg shadow-[#598392]/25' 
                  : 'text-[#598392] hover:bg-[#598392]/10 hover:text-white'
                }
              `}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#598392]/20 mt-auto">
          <div className="bg-[#598392]/10 rounded-xl p-4">
            <p className="text-[#598392] text-sm font-medium mb-1">Admin Access</p>
            <p className="text-[#598392]/70 text-xs">
              You have full control over the system
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
