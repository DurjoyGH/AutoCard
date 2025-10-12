import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Custom toast component
const CustomToast = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: '',
        duration: 4000,
        style: {
          background: 'rgba(1, 22, 30, 0.95)',
          color: '#ffffff',
          border: '1px solid rgba(89, 131, 146, 0.3)',
          borderRadius: '12px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          fontSize: '14px',
          fontWeight: '500',
          padding: '16px 20px',
          maxWidth: '400px',
        },
        // Success toast
        success: {
          duration: 4000,
          style: {
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#22c55e',
          },
          iconTheme: {
            primary: '#22c55e',
            secondary: 'rgba(1, 22, 30, 0.95)',
          },
        },
        // Error toast
        error: {
          duration: 5000,
          style: {
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: 'rgba(1, 22, 30, 0.95)',
          },
        },
        // Loading toast
        loading: {
          style: {
            background: 'rgba(89, 131, 146, 0.1)',
            border: '1px solid rgba(89, 131, 146, 0.3)',
            color: '#598392',
          },
          iconTheme: {
            primary: '#598392',
            secondary: 'rgba(1, 22, 30, 0.95)',
          },
        },
      }}
    />
  );
};

// Custom toast functions with enhanced styling
export const showToast = {
  success: (message, options = {}) => {
    return toast.success(message, {
      ...options,
      icon: '✅',
    });
  },
  
  error: (message, options = {}) => {
    return toast.error(message, {
      ...options,
      icon: '❌',
    });
  },
  
  loading: (message, options = {}) => {
    return toast.loading(message, {
      ...options,
      icon: '⏳',
    });
  },
  
  promise: (promise, messages, options = {}) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Something went wrong',
      },
      {
        ...options,
        loading: {
          icon: '⏳',
        },
        success: {
          icon: '✅',
        },
        error: {
          icon: '❌',
        },
      }
    );
  },
  
  custom: (message, options = {}) => {
    return toast(message, {
      ...options,
      icon: '💫',
    });
  },
  
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
  
  remove: (toastId) => {
    toast.remove(toastId);
  }
};

export default CustomToast;
