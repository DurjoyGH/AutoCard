import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../Toast/CustomToast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout, getUserName, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      // Logout logic
      await logout();
      showToast.success('Logged out successfully');
      navigate('/');
    } else {
      // Navigate to login
      navigate('/login');
    }
  };

  // Dynamic navigation items based on authentication status and role
  const navItems = [
    { name: 'Home', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Contact', path: '/contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    // Show Dashboard for admin, Profile for user
    ...(isAuthenticated 
      ? user?.role === 'admin' 
        ? [{ name: 'Dashboard', path: '/admin/dashboard', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2' }]
        : [{ name: 'Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }]
      : []
    ),
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#01161e]/95 backdrop-blur-md shadow-lg border-b border-[#598392]/20' 
        : 'bg-[#01161e]/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 group">
            <Link to="/" className="flex items-center space-x-3 transition-transform duration-200 group-hover:scale-105">
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="AutoCard Logo" 
                  className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg shadow-lg transition-all duration-300 group-hover:shadow-[#598392]/30"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-[#598392]/20 to-[#124559]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#598392] to-[#124559] bg-clip-text text-transparent">
                  AutoCard
                </span>
                <span className="text-xs text-[#598392]/70 font-medium hidden sm:block">
                  Library Card Generator
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 group ${
                  location.pathname === item.path
                    ? 'text-white bg-[#598392]/20 shadow-md'
                    : 'text-[#598392] hover:text-white hover:bg-[#598392]/10'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="font-medium">{item.name}</span>
                {location.pathname === item.path && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#598392] rounded-full"></div>
                )}
              </Link>
            ))}
            
            {/* Auth Button */}
            <button
              onClick={handleAuthAction}
              className={`ml-4 px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                isAuthenticated
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300'
                  : 'bg-gradient-to-r from-[#598392] to-[#124559] text-white hover:from-[#124559] hover:to-[#598392] shadow-lg hover:shadow-[#598392]/25'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isAuthenticated 
                    ? "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    : "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  } 
                />
              </svg>
              <span>{isAuthenticated ? 'Logout' : 'Login'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#598392] hover:text-white hover:bg-[#598392]/10 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'max-h-screen opacity-100 pb-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="pt-4 space-y-2 border-t border-[#598392]/20">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'text-white bg-[#598392]/20 shadow-md'
                    : 'text-[#598392] hover:text-white hover:bg-[#598392]/10'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            
            <button
              onClick={handleAuthAction}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isAuthenticated
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-gradient-to-r from-[#598392] to-[#124559] text-white hover:from-[#124559] hover:to-[#598392] shadow-lg'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isAuthenticated 
                    ? "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    : "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  } 
                />
              </svg>
              <span>{isAuthenticated ? 'Logout' : 'Login'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;