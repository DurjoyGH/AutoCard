import React, { useState, useEffect, useRef } from 'react';
import { showToast } from '../../components/Toast/CustomToast';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, updateUserProfile, deleteProfilePicture, deleteSignature } from '../../services/userApi';
import { applyForCard, getApplicationStatus } from '../../services/applyApi';
import { makePayment } from '../../services/paymentApi';
import LCFront from '../admin/LC-Front';
import LCBack from '../admin/LC-Back';
import domtoimage from 'dom-to-image-more';
import { jsPDF } from 'jspdf';
import { CheckCircle, CreditCard, Receipt, X } from 'lucide-react';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentID: '',
    department: '',
    hallName: '',
    phoneNumber: '',
    emergencyPhoneNumber: '',
    district: '',
    bloodGroup: '',
    profilePicture: null,
    signature: null
  });
  
  const [photoPreview, setPhotoPreview] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [hasApplication, setHasApplication] = useState(false);
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [paymentStatusText, setPaymentStatusText] = useState('unpaid');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingSlip, setIsDownloadingSlip] = useState(false);
  
  const photoInputRef = useRef(null);
  const signatureInputRef = useRef(null);
  const cardFrontRef = useRef(null);
  const cardBackRef = useRef(null);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const districts = [
    'Dhaka', 'Chittagong', 'Rajshahi', 'Sylhet', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh',
    'Comilla', 'Feni', 'Brahmanbaria', 'Rangamati', 'Noakhali', 'Chandpur', 'Lakshmipur',
    'Cox\'s Bazar', 'Bandarban', 'Khagrachhari', 'Pabna', 'Rajbari', 'Manikganj', 'Sherpur',
    'Bogura', 'Joypurhat', 'Chapainawabganj', 'Naogaon', 'Natore', 'Sirajganj', 'Gaibandha',
    'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Thakurgaon', 'Dinajpur', 'Habiganj',
    'Maulvibazar', 'Sunamganj', 'Narsingdi', 'Gazipur', 'Shariatpur', 'Narayanganj', 'Tangail',
    'Kishoreganj', 'Netrokona', 'Faridpur', 'Gopalganj', 'Madaripur', 'Satkhira',
    'Meherpur', 'Narail', 'Chuadanga', 'Kushtia', 'Magura', 'Bagerhat', 'Jhenaidah',
    'Jhalokati', 'Patuakhali', 'Pirojpur', 'Barguna', 'Bhola'
  ];
  const hallOptions = [
    'Shahid Moshiur Rahman Hall',
    'Munshi Meherullah Hall',
    'Taposhi Rabeya Hall',
    'Birprotik Taramon Bibi Hall',
  ];

  // Calculate profile completion
  useEffect(() => {
    const requiredFields = ['name', 'studentID', 'department', 'hallName', 'phoneNumber', 'emergencyPhoneNumber', 'district', 'bloodGroup'];
    const filledFields = requiredFields.filter(field => formData[field] && formData[field].trim() !== '');
    const hasPhoto = photoPreview || formData.profilePicture;
    const hasSignature = signaturePreview || formData.signature;
    
    const totalRequired = requiredFields.length + 2; // +2 for photo and signature
    const totalFilled = filledFields.length + (hasPhoto ? 1 : 0) + (hasSignature ? 1 : 0);
    
    setProfileCompletion(Math.round((totalFilled / totalRequired) * 100));
  }, [formData, photoPreview, signaturePreview]);

  // Load user profile on component mount
  useEffect(() => {
    loadUserProfile();
    checkApplicationStatus();
  }, []);

  // Populate form with user data from context when available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        studentID: user.studentID || '',
        department: user.department || '',
        hallName: user.hallName || '',
        phoneNumber: user.phoneNumber || '',
        emergencyPhoneNumber: user.emergencyPhoneNumber || '',
        district: user.district || '',
        bloodGroup: user.bloodGroup || '',
        profilePicture: user.profilePicture || null,
        signature: user.signature || null
      }));

      // Set previews if images exist
      if (user.profilePicture) {
        setPhotoPreview(user.profilePicture);
      }
      if (user.signature) {
        setSignaturePreview(user.signature);
      }
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getUserProfile();
      const userData = response.data;
      
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        studentID: userData.studentID || '',
        department: userData.department || '',
        hallName: userData.hallName || '',
        phoneNumber: userData.phoneNumber || '',
        emergencyPhoneNumber: userData.emergencyPhoneNumber || '',
        district: userData.district || '',
        bloodGroup: userData.bloodGroup || '',
        profilePicture: userData.profilePicture || null,
        signature: userData.signature || null
      });

      // Set previews if images exist
      if (userData.profilePicture) {
        setPhotoPreview(userData.profilePicture);
      }
      if (userData.signature) {
        setSignaturePreview(userData.signature);
      }

    } catch (error) {
      console.error('Error loading profile:', error);
      showToast('Failed to load profile data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const response = await getApplicationStatus();
      if (response.hasApplication) {
        setHasApplication(true);
        setApplicationStatus(response.application);
        setIsPaymentDone(!!response.isPaymentDone);
        setPaymentStatusText(response.paymentStatus || 'unpaid');
        setPaymentDetails(response.payment || null);
      } else {
        setHasApplication(false);
        setApplicationStatus(null);
        setIsPaymentDone(false);
        setPaymentStatusText('unpaid');
        setPaymentDetails(null);
      }
    } catch (error) {
      console.error('Error checking application status:', error);
      // User hasn't applied yet or error occurred
      setHasApplication(false);
      setApplicationStatus(null);
      setIsPaymentDone(false);
      setPaymentStatusText('unpaid');
      setPaymentDetails(null);
    }
  };

  const handleApplyForCard = async () => {
    if (profileCompletion !== 100) {
      showToast.error('Please complete your profile before applying');
      return;
    }

    try {
      setIsApplying(true);
      const response = await applyForCard();
      showToast.success('Application submitted successfully!');
      setHasApplication(true);
      setApplicationStatus(response.application);
    } catch (error) {
      console.error('Apply for card error:', error);
      showToast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleMakePayment = async () => {
    if (!applicationStatus?.id) {
      showToast.error('Application not found for payment');
      return;
    }

    try {
      setIsPaying(true);
      const loadingToast = showToast.loading('Redirecting to SSLCommerz...');
      const response = await makePayment(applicationStatus.id);
      showToast.dismiss(loadingToast);

      if (response?.url) {
        window.location.href = response.url;
        return;
      }

      setIsPaying(false);
      showToast.error('Unable to start payment');
    } catch (error) {
      setIsPaying(false);
      showToast.error(error.message || 'Failed to initiate payment');
    }
  };

  const downloadCardAsPDF = async () => {
    if (!applicationStatus || !cardFrontRef.current || !cardBackRef.current) {
      showToast.error('Card is not ready for download');
      return;
    }

    setIsDownloading(true);
    try {
      const frontCardElement = cardFrontRef.current.querySelector('.bg-white.rounded-2xl');
      const backCardElement = cardBackRef.current.querySelector('.bg-white.rounded-2xl');

      if (!frontCardElement || !backCardElement) {
        showToast.error('Card elements not found');
        setIsDownloading(false);
        return;
      }

      const frontClone = frontCardElement.cloneNode(true);
      const backClone = backCardElement.cloneNode(true);

      frontClone.style.boxShadow = 'none';
      frontClone.style.borderRadius = '0';
      frontClone.style.aspectRatio = 'unset';
      frontClone.style.height = 'auto';
      frontClone.style.minHeight = '0';
      frontClone.style.overflow = 'visible';

      backClone.style.boxShadow = 'none';
      backClone.style.borderRadius = '0';
      backClone.style.aspectRatio = 'unset';
      backClone.style.height = 'auto';
      backClone.style.minHeight = '0';
      backClone.style.overflow = 'visible';

      const removeElementBorders = (element) => {
        element.querySelectorAll('*').forEach((el) => {
          el.style.border = 'none';
          el.style.boxShadow = 'none';
        });

        element.querySelectorAll('.border-2, .border').forEach((el) => {
          el.style.border = 'none';
        });
      };

      removeElementBorders(frontClone);
      removeElementBorders(backClone);

      frontClone.style.position = 'absolute';
      frontClone.style.left = '-9999px';
      frontClone.style.top = '-9999px';
      backClone.style.position = 'absolute';
      backClone.style.left = '-9999px';
      backClone.style.top = '-9999px';

      document.body.appendChild(frontClone);
      document.body.appendChild(backClone);

      await new Promise((resolve) => setTimeout(resolve, 200));

      const initialFrontWidth = frontClone.offsetWidth;
      const initialBackWidth = backClone.offsetWidth;
      const targetWidth = Math.max(initialFrontWidth, initialBackWidth);

      frontClone.style.width = `${targetWidth}px`;
      backClone.style.width = `${targetWidth}px`;

      await new Promise((resolve) => setTimeout(resolve, 100));

      const frontWidth = frontClone.offsetWidth;
      const frontHeight = frontClone.offsetHeight;
      const backWidth = backClone.offsetWidth;
      const backHeight = backClone.offsetHeight;

      const frontImageData = await domtoimage.toPng(frontClone, {
        quality: 1,
        bgcolor: '#ffffff',
        width: frontWidth,
        height: frontHeight,
      });

      const backImageData = await domtoimage.toPng(backClone, {
        quality: 1,
        bgcolor: '#ffffff',
        width: backWidth,
        height: backHeight,
      });

      document.body.removeChild(frontClone);
      document.body.removeChild(backClone);

      const pdfWidth = Math.max(frontWidth, backWidth);
      const pdfHeight = Math.max(frontHeight, backHeight);
      const orientation = pdfWidth > pdfHeight ? 'landscape' : 'portrait';

      const pdf = new jsPDF({
        orientation,
        unit: 'px',
        format: [pdfWidth, pdfHeight],
        compress: true,
      });

      pdf.addImage(frontImageData, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST');
      pdf.addPage([pdfWidth, pdfHeight], orientation);
      pdf.addImage(backImageData, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST');

      const fileName = `LibraryCard_${applicationStatus.name.replace(/\s+/g, '_')}_${applicationStatus.studentID}.pdf`;
      pdf.save(fileName);
      showToast.success('Library card downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast.error('Failed to download card. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadPaymentSlip = async () => {
    if (!paymentDetails || !applicationStatus) {
      showToast.error('Payment details not found');
      return;
    }

    setIsDownloadingSlip(true);
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const now = new Date();

      const logoDataUrl = await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } catch (e) {
            resolve(null);
          }
        };
        img.onerror = () => resolve(null);
        img.src = '/logo.png';
      });

      if (logoDataUrl) {
        doc.addImage(logoDataUrl, 'PNG', 90, 8, 30, 30);
      }

      doc.setFontSize(18);
      doc.text('Library Card Payment Slip', 105, 50, { align: 'center' });

      doc.setFontSize(11);
      doc.text('Jashore University of Science and Technology', 105, 57, { align: 'center' });

      doc.setDrawColor(160, 160, 160);
      doc.line(15, 63, 195, 63);

      let y = 73;
      const row = (label, value) => {
        doc.setFont(undefined, 'bold');
        doc.text(`${label}:`, 18, y);
        doc.setFont(undefined, 'normal');
        doc.text(String(value || '-'), 70, y);
        y += 9;
      };

      row('Slip Date', now.toLocaleString());
      row('Student Name', applicationStatus.name);
      row('Student ID', applicationStatus.studentID);
      row('Department', applicationStatus.department);
      row('Application ID', applicationStatus.id);
      row('Transaction ID', paymentDetails.transactionId);
      row('Amount', `BDT ${paymentDetails.amount}`);
      row('Currency', paymentDetails.currency || 'BDT');
      row('Payment Status', paymentDetails.status || paymentStatusText);
      row('Gateway', paymentDetails.gateway || 'SSLCommerz-Sandbox');
      row(
        'Paid At',
        paymentDetails.paidAt
          ? new Date(paymentDetails.paidAt).toLocaleString()
          : '-'
      );

      doc.line(15, y + 4, 195, y + 4);
      doc.setFontSize(10);
      doc.text('This is a system-generated payment slip.', 18, y + 12);

      const fileName = `PaymentSlip_${applicationStatus.studentID}_${paymentDetails.transactionId}.pdf`;
      doc.save(fileName);
      showToast.success('Payment slip downloaded');
    } catch (error) {
      console.error('Slip download error:', error);
      showToast.error('Failed to download payment slip');
    } finally {
      setIsDownloadingSlip(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = type === 'photo' 
      ? ['image/jpeg', 'image/png', 'image/jpg']
      : ['image/jpeg', 'image/png', 'image/jpg'];
    
    if (!validTypes.includes(file.type)) {
      showToast.error(`Please select a valid ${type === 'photo' ? 'image' : 'signature'} file (JPG, PNG)`);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast.error('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'photo') {
        setPhotoPreview(e.target.result);
        setFormData(prev => ({ ...prev, profilePicture: file }));
      } else {
        setSignaturePreview(e.target.result);
        setFormData(prev => ({ ...prev, signature: file }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = async (type) => {
    try {
      setIsLoading(true);
      
      if (type === 'photo') {
        // If there's an existing profile picture on server, delete it
        if (formData.profilePicture && typeof formData.profilePicture === 'string') {
          await deleteProfilePicture();
          showToast.success('Profile picture deleted successfully');
        }
        
        setPhotoPreview(null);
        setFormData(prev => ({ ...prev, profilePicture: null }));
        if (photoInputRef.current) photoInputRef.current.value = '';
        
        if (typeof formData.profilePicture !== 'string') {
          showToast.success('Photo removed successfully');
        }
      } else {
        // If there's an existing signature on server, delete it
        if (formData.signature && typeof formData.signature === 'string') {
          await deleteSignature();
          showToast.success('Signature deleted successfully');
        }
        
        setSignaturePreview(null);
        setFormData(prev => ({ ...prev, signature: null }));
        if (signatureInputRef.current) signatureInputRef.current.value = '';
        
        if (typeof formData.signature !== 'string') {
          showToast.success('Signature removed successfully');
        }
      }
      
      // Update user context if needed
      if ((type === 'photo' && formData.profilePicture && typeof formData.profilePicture === 'string') ||
          (type === 'signature' && formData.signature && typeof formData.signature === 'string')) {
        // Reload profile to get updated data
        await loadUserProfile();
      }
      
    } catch (error) {
      console.error('Error removing file:', error);
      showToast.error(error.message || `Failed to remove ${type === 'photo' ? 'photo' : 'signature'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = {
      name: 'Full Name',
      studentID: 'Student ID',
      department: 'Department',
      hallName: 'Hall Name',
      phoneNumber: 'Contact Number',
      emergencyPhoneNumber: 'Emergency Contact Number',
      district: 'District',
      bloodGroup: 'Blood Group'
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].trim() === '') {
        showToast.error(`${label} is required`);
        return;
      }
    }

    // Validate phone numbers
    const phoneRegex = /^(\+8801|8801|01)[3-9]\d{8}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      showToast.error('Please enter a valid contact number');
      return;
    }
    if (!phoneRegex.test(formData.emergencyPhoneNumber)) {
      showToast.error('Please enter a valid emergency contact number');
      return;
    }

    if (!photoPreview && !formData.profilePicture) {
      showToast.error('Profile photo is required');
      return;
    }

    if (!signaturePreview && !formData.signature) {
      showToast.error('Signature is required');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare profile data
      const profileData = {
        name: formData.name,
        studentID: formData.studentID,
        department: formData.department,
        hallName: formData.hallName,
        phoneNumber: formData.phoneNumber,
        emergencyPhoneNumber: formData.emergencyPhoneNumber,
        district: formData.district,
        bloodGroup: formData.bloodGroup
      };

      // Prepare files
      const files = {};
      if (formData.profilePicture && formData.profilePicture instanceof File) {
        files.profilePicture = formData.profilePicture;
      }
      if (formData.signature && formData.signature instanceof File) {
        files.signature = formData.signature;
      }

      const updatePromise = updateUserProfile(profileData, files);

      const response = await showToast.promise(
        updatePromise,
        {
          loading: 'Updating profile...',
          success: 'Profile updated successfully!',
          error: 'Failed to update profile'
        }
      );

      // Update the auth context with new user data
      if (response.data) {
        updateUser(response.data);
      }

      // Reload profile data to get updated information
      await loadUserProfile();

    } catch (error) {
      console.error('Profile update error:', error);
      showToast.error(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canApplyForCard = profileCompletion === 100 && !hasApplication;
  const canMakePayment =
    hasApplication &&
    applicationStatus?.status === 'approved' &&
    !isPaymentDone;
  const canDownloadCard =
    hasApplication &&
    applicationStatus?.status === 'approved' &&
    isPaymentDone;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'approved':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'rejected':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-[#598392]/80">
            Complete your profile to apply for a library card
          </p>
        </div>

        {/* Profile Completion Progress */}
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Profile Completion</h3>
            <span className={`font-bold ${profileCompletion === 100 ? 'text-green-400' : 'text-[#598392]'}`}>
              {profileCompletion}%
            </span>
          </div>
          <div className="w-full bg-[#598392]/20 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                profileCompletion === 100 ? 'bg-green-400' : 'bg-gradient-to-r from-[#598392] to-[#124559]'
              }`}
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
          {profileCompletion === 100 && (
            <div className="mt-4 p-4 bg-green-400/10 border border-green-400/20 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-400 font-medium">
                  Profile complete! You can now apply for a library card.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Application Status */}
        {hasApplication && applicationStatus && (
          <div className={`backdrop-blur-xl border rounded-2xl p-6 mb-8 ${getStatusColor(applicationStatus.status)}`}>
            <h3 className="font-semibold text-lg mb-2">Library Card Application Status</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">
                  Applied on: {new Date(applicationStatus.appliedAt).toLocaleDateString()}
                </p>
                <p className="mt-2">
                  <span className="font-medium">Status: </span>
                  <span className="font-bold">{getStatusText(applicationStatus.status)}</span>
                </p>
                <p className="mt-2">
                  <span className="font-medium">Payment: </span>
                  <span className="font-bold uppercase">{paymentStatusText}</span>
                </p>
                {applicationStatus.status === 'rejected' && applicationStatus.rejectionReason && (
                  <p className="mt-2 text-sm">
                    <span className="font-medium">Reason: </span>
                    {applicationStatus.rejectionReason}
                  </p>
                )}
              </div>
              {applicationStatus.status === 'pending' && (
                <div className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm">Under Review</span>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Photo Upload Section */}
          <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-6">Profile Photo</h3>
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Photo Preview */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-xl border-2 border-dashed border-[#598392]/30 flex items-center justify-center overflow-hidden bg-[#598392]/10">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <svg className="w-8 h-8 text-[#598392]/60 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-[#598392]/60 text-xs">No photo</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'photo')}
                  className="hidden"
                />
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="px-4 py-2 bg-gradient-to-r from-[#598392] to-[#124559] text-white rounded-lg font-medium hover:from-[#124559] hover:to-[#598392] transition-all duration-200 text-sm"
                    >
                      {photoPreview ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={() => removeFile('photo')}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-all duration-200 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[#598392]/60 text-xs">
                    Upload a clear photo (JPG, PNG, max 5MB). This will be used for your library card.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email (Read Only) */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="w-full px-4 py-3 bg-[#598392]/5 border border-[#598392]/20 rounded-xl text-[#598392]/60 cursor-not-allowed"
                  placeholder="Email cannot be changed"
                  disabled
                />
                <p className="text-[#598392]/60 text-xs mt-1">Email address cannot be modified</p>
              </div>

              {/* Student ID */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Student ID *
                </label>
                <input
                  type="text"
                  name="studentID"
                  value={formData.studentID}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your student ID"
                  required
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Computer Science & Engineering"
                  required
                />
              </div>

              {/* Hall Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Hall Name *
                </label>
                <select
                  name="hallName"
                  value={formData.hallName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#598392]/50 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="" className="bg-[#01161e] text-white">Select your hall</option>
                  {hallOptions.map((hall) => (
                    <option key={hall} value={hall} className="bg-[#01161e] text-white">
                      {hall}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50 focus:border-transparent transition-all duration-200"
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>

              {/* Emergency Contact Number */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Emergency Contact Number *
                </label>
                <input
                  type="tel"
                  name="emergencyPhoneNumber"
                  value={formData.emergencyPhoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50 focus:border-transparent transition-all duration-200"
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  District *
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#598392]/50 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select your district</option>
                  {districts.map(district => (
                    <option key={district} value={district} className="bg-[#01161e] text-white">
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Blood Group *
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#598392]/50 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select your blood group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group} className="bg-[#01161e] text-white">
                      {group}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Signature Upload Section */}
          <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-6">Digital Signature</h3>
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Signature Preview */}
              <div className="flex-shrink-0">
                <div className="w-48 h-24 rounded-xl border-2 border-dashed border-[#598392]/30 flex items-center justify-center overflow-hidden bg-[#598392]/10">
                  {signaturePreview ? (
                    <img
                      src={signaturePreview}
                      alt="Signature Preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <svg className="w-6 h-6 text-[#598392]/60 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <p className="text-[#598392]/60 text-xs">No signature</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                <input
                  ref={signatureInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'signature')}
                  className="hidden"
                />
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => signatureInputRef.current?.click()}
                      className="px-4 py-2 bg-gradient-to-r from-[#598392] to-[#124559] text-white rounded-lg font-medium hover:from-[#124559] hover:to-[#598392] transition-all duration-200 text-sm"
                    >
                      {signaturePreview ? 'Change Signature' : 'Upload Signature'}
                    </button>
                    {signaturePreview && (
                      <button
                        type="button"
                        onClick={() => removeFile('signature')}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-all duration-200 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[#598392]/60 text-xs">
                    Upload a clear signature image (JPG, PNG, max 5MB). White background preferred.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              className="px-8 py-3 border border-[#598392]/30 text-[#598392] rounded-xl font-medium hover:bg-[#598392]/10 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-[#598392] to-[#124559] text-white rounded-xl font-medium hover:from-[#124559] hover:to-[#598392] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#598392]/50 transition-all duration-200 shadow-lg hover:shadow-[#598392]/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </button>
          </div>

          {/* Apply for Library Card Button */}
          {canApplyForCard && (
            <div className="bg-green-400/10 border border-green-400/20 rounded-2xl p-6 mt-8">
              <div className="text-center">
                <h3 className="text-green-400 font-semibold text-lg mb-2">
                  Ready to Apply!
                </h3>
                <p className="text-green-400/80 mb-4">
                  Your profile is complete. You can now apply for your library card.
                </p>
                <button
                  type="button"
                  onClick={handleApplyForCard}
                  disabled={isApplying}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-green-500/25 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center mx-auto"
                >
                  {isApplying ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Application...
                    </>
                  ) : (
                    'Apply for Library Card'
                  )}
                </button>
              </div>
            </div>
          )}

          {canMakePayment && (
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-2xl p-6 mt-8">
              <div className="text-center">
                <h3 className="text-yellow-400 font-semibold text-lg mb-2">
                  Card Approved! Payment Required
                </h3>
                <p className="text-yellow-400/80 mb-4">
                  Admin approved your card request. Please complete sandbox payment to download your card.
                </p>
                <button
                  type="button"
                  onClick={handleMakePayment}
                  disabled={isPaying}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl font-medium hover:from-yellow-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-yellow-500/25 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center mx-auto"
                >
                  {isPaying ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Redirecting to Payment...
                    </>
                  ) : (
                    'Make Payment (Sandbox)'
                  )}
                </button>
              </div>
            </div>
          )}

          {canDownloadCard && (
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-2xl p-6 mt-8">
              <div className="text-center">
                <h3 className="text-yellow-400 font-semibold text-lg mb-2 flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Payment Complete
                </h3>
                <p className="text-yellow-400/80 mb-4">
                  Your payment is done. You can now download your library card.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={downloadCardAsPDF}
                    disabled={isDownloading}
                    className="px-8 py-3 bg-gradient-to-r from-[#598392] to-[#124559] text-white rounded-xl font-medium hover:from-[#124559] hover:to-[#598392] transition-all duration-200 shadow-lg hover:shadow-[#598392]/25 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    {isDownloading ? 'Downloading Card...' : 'Download Library Card'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(true)}
                    className="px-8 py-3 bg-[#0f3a46]/60 border border-[#598392]/30 text-[#9ac1cd] rounded-xl font-medium hover:bg-[#0f3a46]/80 transition-all duration-200 shadow-lg hover:shadow-[#598392]/20 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Receipt className="w-5 h-5" />
                    Payment Details
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>

        {showPaymentModal && paymentDetails && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#01161e] border border-[#598392]/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#598392]" />
                  Payment Details
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="text-[#598392] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-[#0f3a46]/40 border border-[#598392]/20 rounded-xl p-4 space-y-3">
                <div className="flex justify-between gap-3">
                  <span className="text-[#598392]/80">Transaction ID</span>
                  <span className="text-white text-right break-all">{paymentDetails.transactionId || '-'}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[#598392]/80">Amount</span>
                  <span className="text-white">BDT {paymentDetails.amount || '100'}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[#598392]/80">Currency</span>
                  <span className="text-white">{paymentDetails.currency || 'BDT'}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[#598392]/80">Status</span>
                  <span className="text-green-400 uppercase font-semibold">{paymentDetails.status || paymentStatusText}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[#598392]/80">Gateway</span>
                  <span className="text-white">{paymentDetails.gateway || 'SSLCommerz-Sandbox'}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[#598392]/80">Paid At</span>
                  <span className="text-white text-right">
                    {paymentDetails.paidAt ? new Date(paymentDetails.paidAt).toLocaleString() : '-'}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-5 py-2.5 bg-[#0f3a46]/60 border border-[#598392]/30 text-[#9ac1cd] rounded-lg hover:bg-[#0f3a46]/80 transition-all"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={downloadPaymentSlip}
                  disabled={isDownloadingSlip}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#598392] to-[#124559] text-white rounded-lg hover:from-[#124559] hover:to-[#598392] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Receipt className="w-4 h-4" />
                  {isDownloadingSlip ? 'Downloading Slip...' : 'Download Payment Slip'}
                </button>
              </div>
            </div>
          </div>
        )}

        {canDownloadCard && (
          <div className="absolute -left-[9999px] -top-[9999px]" aria-hidden="true">
            <div ref={cardFrontRef}>
              <LCFront applicationData={applicationStatus} />
            </div>
            <div ref={cardBackRef}>
              <LCBack applicationData={applicationStatus} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;