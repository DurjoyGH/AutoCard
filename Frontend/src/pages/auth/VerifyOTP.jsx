import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import backgroundImage from '../../assets/just.jpg';
import { showToast } from '../../components/Toast/CustomToast';
import { authApi } from '../../services/authApi';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  // Get user data from navigation state or localStorage
  const userData = location.state?.userData || JSON.parse(localStorage.getItem('pendingUser') || '{}');
  const userEmail = userData.email || '';
  const userId = userData.userId || userData._id || '';

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Redirect if no user data
  useEffect(() => {
    if (!userEmail || !userId) {
      showToast.error('Session expired. Please register again.');
      navigate('/register');
    }
  }, [userEmail, userId, navigate]);

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pastedData.length === 5) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[4]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 5) {
      showToast.error('Please enter the complete 5-digit verification code');
      return;
    }

    setIsLoading(true);

    try {
      const verifyPromise = authApi.verify({
        userId: userId,
        verificationToken: otpString
      });

      const response = await showToast.promise(
        verifyPromise,
        {
          loading: 'Verifying your account...',
          success: 'Account verified successfully! Redirecting...',
          error: (err) => err.message || 'Invalid verification code'
        }
      );

      // Clear pending user data
      localStorage.removeItem('pendingUser');

      // Role-based redirection
      const redirectPath = response.role === 'admin' 
        ? '/admin/dashboard' 
        : '/profile';

      // Redirect based on user role
      setTimeout(() => {
        navigate(redirectPath);
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('OTP verification error:', error);
      // Clear invalid OTP
      setOtp(['', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;

    setIsResending(true);

    try {
      const resendPromise = authApi.resendVerification(userEmail);

      const response = await showToast.promise(
        resendPromise,
        {
          loading: 'Sending new verification code...',
          success: 'New verification code sent!',
          error: (err) => err.message || 'Failed to resend verification code'
        }
      );

      // Reset timer
      setTimeLeft(300);
      setCanResend(false);
      setOtp(['', '', '', '', '']);
      inputRefs.current[0]?.focus();

    } catch (error) {
      console.error('Resend OTP error:', error);
    } finally {
      setIsResending(false);
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

      {/* Verification Form */}
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
          <h2 className="text-3xl font-bold text-white mb-2">Verify Your Account</h2>
          <p className="text-[#598392]/80 mb-2">
            We've sent a 5-digit verification code to
          </p>
          <p className="text-white font-medium">{userEmail}</p>
        </div>

        {/* Form */}
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-4 text-center">
                Enter Verification Code
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-bold bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#598392]/50 focus:border-transparent transition-all duration-200"
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              {!canResend ? (
                <p className="text-[#598392]/80 text-sm">
                  Resend code in{' '}
                  <span className="font-bold text-[#598392]">
                    {formatTime(timeLeft)}
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-[#598392] hover:text-white transition-colors duration-200 text-sm font-medium disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : 'Resend verification code'}
                </button>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 5}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-white font-medium bg-gradient-to-r from-[#598392] to-[#124559] hover:from-[#124559] hover:to-[#598392] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#598392]/50 transition-all duration-200 shadow-lg hover:shadow-[#598392]/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                'Verify Account'
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 space-y-4">
            {/* Tips */}
            <div className="bg-[#598392]/10 border border-[#598392]/20 rounded-lg p-4">
              <h4 className="text-[#598392] font-medium text-sm mb-2">Tips:</h4>
              <ul className="text-[#598392]/80 text-xs space-y-1">
                <li>• Check your email inbox and spam folder</li>
                <li>• The code expires in 5 minutes</li>
                <li>• You can paste the entire code at once</li>
              </ul>
            </div>

            {/* Change Email */}
            <div className="text-center">
              <p className="text-[#598392]/80 text-sm">
                Wrong email address?{' '}
                <Link
                  to="/register"
                  className="text-[#598392] hover:text-white transition-colors duration-200 font-medium"
                >
                  Register again
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="inline-flex items-center text-[#598392]/80 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;