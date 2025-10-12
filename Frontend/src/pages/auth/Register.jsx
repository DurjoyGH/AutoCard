import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/just.jpg';
import { showToast } from '../../components/Toast/CustomToast';
import { authApi } from '../../services/authApi';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Full Name validation
    if (!formData.fullName.trim()) {
      showToast.error('Please enter your full name');
      return false;
    }

    if (formData.fullName.trim().length < 2) {
      showToast.error('Full name must be at least 2 characters');
      return false;
    }

    // Email validation
    if (!formData.email) {
      showToast.error('Please enter your email address');
      return false;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      showToast.error('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (!formData.password) {
      showToast.error('Please enter a password');
      return false;
    }

    if (formData.password.length < 6) {
      showToast.error('Password must be at least 6 characters long');
      return false;
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      showToast.error('Please confirm your password');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create registration promise for toast
      const registerPromise = authApi.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      const response = await showToast.promise(
        registerPromise,
        {
          loading: 'Creating your account...',
          success: 'Account created! Please check your email for verification.',
          error: (err) => err.message || 'Registration failed. Please try again.'
        }
      );

      // Store user data for OTP verification and redirect
      const userData = {
        email: formData.email,
        userId: response.userId, // Backend returns userId directly
        name: formData.fullName
      };
      
      localStorage.setItem('pendingUser', JSON.stringify(userData));

      // Immediate navigation without setTimeout
      navigate('/verify-otp', { state: { userData } });

    } catch (error) {
      console.error('Registration error:', error);
      // Error is already handled by the toast promise
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const levels = [
      { text: 'Very Weak', color: 'text-red-400' },
      { text: 'Weak', color: 'text-orange-400' },
      { text: 'Fair', color: 'text-yellow-400' },
      { text: 'Good', color: 'text-blue-400' },
      { text: 'Strong', color: 'text-green-400' }
    ];

    return { strength, ...levels[strength] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
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

      {/* Register Form */}
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
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-[#598392]/80">Join us to start generating library cards</p>
        </div>

        {/* Form */}
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50 focus:border-transparent transition-all duration-200 pl-12"
                  placeholder="Enter your full name"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#598392]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50 focus:border-transparent transition-all duration-200 pl-12 pr-12"
                  placeholder="Create a password (min 6 characters)"
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
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-[#598392]/80">Password Strength:</span>
                    <span className={`text-xs font-medium ${passwordStrength.color}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-[#598392]/20 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        passwordStrength.strength <= 1 ? 'bg-red-400' :
                        passwordStrength.strength <= 2 ? 'bg-orange-400' :
                        passwordStrength.strength <= 3 ? 'bg-yellow-400' :
                        passwordStrength.strength <= 4 ? 'bg-blue-400' : 'bg-green-400'
                      }`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#598392]/10 border rounded-xl text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50 focus:border-transparent transition-all duration-200 pl-12 pr-12 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-400/50 focus:ring-red-400/50'
                      : formData.confirmPassword && formData.password === formData.confirmPassword
                      ? 'border-green-400/50 focus:ring-green-400/50'
                      : 'border-[#598392]/30'
                  }`}
                  placeholder="Confirm your password"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#598392]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#598392]/60 hover:text-[#598392] transition-colors duration-200"
                >
                  {showConfirmPassword ? (
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
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center">
                  {formData.password === formData.confirmPassword ? (
                    <div className="flex items-center text-green-400 text-xs">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Passwords match
                    </div>
                  ) : (
                    <div className="flex items-center text-red-400 text-xs">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Passwords do not match
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-[#598392] bg-[#598392]/10 border border-[#598392]/30 rounded focus:ring-[#598392]/50 focus:ring-2"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-[#598392]/80">
                I agree to the{' '}
                <Link to="/terms" className="text-[#598392] hover:text-white transition-colors duration-200 font-medium">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-[#598392] hover:text-white transition-colors duration-200 font-medium">
                  Privacy Policy
                </Link>
              </label>
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-[#598392]/80 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#598392] hover:text-white transition-colors duration-200 font-medium"
              >
                Sign in here
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

export default Register;