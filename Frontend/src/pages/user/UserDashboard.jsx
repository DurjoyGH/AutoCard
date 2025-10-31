import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import backgroundImage from '../../assets/just.jpg';
import { ArrowRight, LogIn, UserPlus, Mail } from 'lucide-react';

const UserDashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleApplyClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
            Welcome to <span className="bg-gradient-to-r from-[#598392] to-[#AEC3B0] bg-clip-text text-transparent">AutoCard</span>
          </h1>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white/90 mb-8">
            Jashore University of Science & Technology
          </h2>
          
          <p className="text-lg sm:text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Digital Library Card Generation System - Simplifying your library access
          </p>

          <button
            onClick={handleApplyClick}
            className="group px-10 py-4 bg-gradient-to-r from-[#598392] to-[#124559] text-white text-lg font-semibold rounded-full hover:from-[#124559] hover:to-[#598392] transition-all duration-300 shadow-2xl hover:shadow-[#598392]/50 transform hover:scale-105 flex items-center gap-3 mx-auto"
          >
            <span>Apply For Card</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* About Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Details Text */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                About <span className="bg-gradient-to-r from-[#598392] to-[#124559] bg-clip-text text-transparent">AutoCard</span>
              </h2>
              
              <p className="text-lg text-[#598392]/90 leading-relaxed">
                AutoCard is a modern digital library card generation system designed specifically for 
                <strong className="text-white"> Jashore University of Science & Technology (JUST)</strong>. 
                Our platform streamlines the process of obtaining and managing library cards, making it 
                easier than ever for students and faculty to access library resources.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-[#598392]/10 p-4 rounded-xl border border-[#598392]/20 hover:border-[#598392]/40 transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#598392] to-[#124559] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Fast & Easy Process</h3>
                    <p className="text-[#598392]/80 text-sm">Complete your application in minutes with our streamlined digital process.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-[#598392]/10 p-4 rounded-xl border border-[#598392]/20 hover:border-[#598392]/40 transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#598392] to-[#124559] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Secure & Reliable</h3>
                    <p className="text-[#598392]/80 text-sm">Your personal information is protected with industry-standard security measures.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-[#598392]/10 p-4 rounded-xl border border-[#598392]/20 hover:border-[#598392]/40 transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#598392] to-[#124559] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">24/7 Access</h3>
                    <p className="text-[#598392]/80 text-sm">Apply anytime, anywhere. Track your application status in real-time.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <p className="text-[#598392]/80 text-base">
                  Join thousands of JUST students and faculty members who have already simplified 
                  their library access with AutoCard. Get started today and experience the future 
                  of library management.
                </p>
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#01161e]/80 to-[#124559]/80 backdrop-blur-xl border border-[#598392]/30 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Get Started</h3>
                
                <div className="space-y-4">
                  {/* Login Button */}
                  <Link
                    to="/login"
                    className="group w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <LogIn className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold">Login</div>
                        <div className="text-xs text-white/80">Access your account</div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>

                  {/* Signup Button */}
                  <Link
                    to="/register"
                    className="group w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/50 transform hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <UserPlus className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold">Sign Up</div>
                        <div className="text-xs text-white/80">Create new account</div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>

                  {/* Contact Button */}
                  <Link
                    to="/contact"
                    className="group w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/50 transform hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold">Contact Us</div>
                        <div className="text-xs text-white/80">Get help & support</div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-[#598392]/10 border border-[#598392]/30 rounded-xl">
                  <p className="text-[#598392]/90 text-sm text-center">
                    <span className="font-semibold text-white">New to AutoCard?</span>
                    <br />
                    Sign up to create your account and apply for your library card.
                  </p>
                </div>
              </div>

              {/* Additional Info Card */}
              <div className="bg-gradient-to-br from-[#598392]/20 to-[#124559]/20 backdrop-blur-xl border border-[#598392]/30 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#598392] to-[#124559] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold text-lg">Need Help?</h4>
                </div>
                <p className="text-[#598392]/80 text-sm leading-relaxed">
                  Our support team is available to assist you with any questions about the application process. 
                  Feel free to reach out through our contact page.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;