import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navigation/Navbar';
import Footer from '../Navigation/Footer';

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#01161e] via-[#124559] to-[#01161e] flex flex-col">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1 pt-16 lg:pt-20">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserLayout;