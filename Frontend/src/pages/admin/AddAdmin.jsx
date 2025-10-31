import React, { useState } from 'react';
import { Shield, Mail, Lock, Phone, User, UserPlus, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { createAdmin } from '../../services/adminApi';
import { showToast } from '../../components/Toast/CustomToast';

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Phone number validation (optional but if provided, must be valid)
    if (formData.phoneNumber && !/^\+?[\d\s\-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast.error('Please fix the form errors');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await createAdmin(formData);

      showToast.success(`Admin ${formData.name} created successfully!`);

      if (response.emailSent) {
        showToast.success('Login credentials sent to admin email');
      } else {
        showToast.warning('Admin created but email delivery failed');
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating admin:', error);
      showToast.error(error.message || 'Failed to create admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one of each required character type
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
    password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Special char
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setFormData((prev) => ({
      ...prev,
      password: password,
    }));
    setShowPassword(true);
    showToast.success('Strong password generated!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Add New Administrator</h1>
        <p className="text-[#598392]/80">
          Create a new admin account with full system privileges
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Admin Privileges</h3>
            <p className="text-[#598392]/80 text-sm mb-3">
              The new administrator will have full access to:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-[#598392]/80">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                User management and deletion
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Application review and approval
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                System dashboard and analytics
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Create new administrator accounts
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-white font-medium mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#598392]/60" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter administrator's full name"
                className={`w-full pl-10 pr-4 py-3 bg-[#598392]/10 border ${
                  errors.name ? 'border-red-500' : 'border-[#598392]/30'
                } rounded-lg text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50`}
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-white font-medium mb-2">
              Email Address <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#598392]/60" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className={`w-full pl-10 pr-4 py-3 bg-[#598392]/10 border ${
                  errors.email ? 'border-red-500' : 'border-[#598392]/30'
                } rounded-lg text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50`}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
            <p className="text-[#598392]/60 text-xs mt-1">
              Login credentials will be sent to this email
            </p>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-white font-medium mb-2">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#598392]/60" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a strong password"
                className={`w-full pl-10 pr-20 py-3 bg-[#598392]/10 border ${
                  errors.password ? 'border-red-500' : 'border-[#598392]/30'
                } rounded-lg text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#598392]/60 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
            <div className="flex justify-between items-center mt-2">
              <p className="text-[#598392]/60 text-xs">
                Min 8 characters, include uppercase, lowercase, and number
              </p>
              <button
                type="button"
                onClick={generatePassword}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Generate Strong Password
              </button>
            </div>
          </div>

          {/* Phone Number Field */}
          <div>
            <label htmlFor="phoneNumber" className="block text-white font-medium mb-2">
              Phone Number <span className="text-[#598392]/60 text-sm">(Optional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#598392]/60" />
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className={`w-full pl-10 pr-4 py-3 bg-[#598392]/10 border ${
                  errors.phoneNumber ? 'border-red-500' : 'border-[#598392]/30'
                } rounded-lg text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  phoneNumber: '',
                });
                setErrors({});
              }}
              className="flex-1 px-6 py-3 bg-[#598392]/10 text-[#598392] rounded-lg hover:bg-[#598392]/20 transition-all duration-200 font-medium"
              disabled={isSubmitting}
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg hover:from-purple-600 hover:to-purple-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Creating Admin...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Admin Account
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-yellow-400 font-medium mb-1">Security Best Practices</h4>
            <ul className="text-yellow-400/80 text-sm space-y-1">
              <li>• The new admin will receive login credentials via email</li>
              <li>• Advise them to change their password after first login</li>
              <li>• Ensure the email address is correct and secure</li>
              <li>• Only create admin accounts for trusted personnel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;
