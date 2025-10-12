import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/just.jpg';
import { showToast } from '../../components/Toast/CustomToast';
import { authApi } from '../../services/authApi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      showToast.error('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      showToast.error('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      showToast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Create login promise for toast
      const loginPromise = authApi.login({
        email: formData.email,
        password: formData.password,
      });

      const response = await showToast.promise(
        loginPromise,
        {
          loading: 'Signing you in...',
          success: 'Welcome back! Redirecting...',
          error: (err) => err.message || 'Invalid email or password'
        }
      );

      // Redirect to dashboard after success
      setTimeout(() => {
        navigate('/dashboard');
        window.location.reload(); // Refresh to update auth state
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);
      // Error is already handled by the toast promise
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#01161e]/90 via-[#124559]/85 to-[#01161e]/90"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <img 
              src="/logo.png" 
              alt="AutoCard Logo" 
              className="h-12 w-12 rounded-lg shadow-lg"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#598392] to-white bg-clip-text text-transparent">
                AutoCard
              </span>
              <span className="text-xs text-[#598392]/70 font-medium">
                Library Card Generator
              </span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-[#598392]/80">Sign in to your account to continue</p>
        </div>

        {/* Form */}
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50 focus:border-transparent transition-all duration-200 pl-12"
                  placeholder="Enter your email"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#598392]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50 focus:border-transparent transition-all duration-200 pl-12 pr-12"
                  placeholder="Enter your password"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#598392]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#598392]/60 hover:text-[#598392] transition-colors duration-200"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-1.414-1.414M14.12 14.12l1.414 1.414M14.12 14.12L15.536 15.536M14.12 14.12l1.414 1.414M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#598392] bg-[#598392]/10 border border-[#598392]/30 rounded focus:ring-[#598392]/50 focus:ring-2"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#598392]/80">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-[#598392] hover:text-white transition-colors duration-200 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-white font-medium bg-gradient-to-r from-[#598392] to-[#124559] hover:from-[#124559] hover:to-[#598392] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#598392]/50 transition-all duration-200 shadow-lg hover:shadow-[#598392]/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-[#598392]/80 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-[#598392] hover:text-white transition-colors duration-200 font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center text-[#598392]/80 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;