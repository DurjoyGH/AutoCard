import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCardDetails } from '../../services/scanApi';
import { showToast } from '../../components/Toast/CustomToast';
import { CheckCircle, AlertCircle, ChevronLeft, Mail, Phone, Award } from 'lucide-react';

const ScannedPage = () => {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCardDetails(cardId);
        setCardData(response.card);
      } catch (err) {
        setError(err.message);
        showToast.error(err.message || 'Failed to load card details');
      } finally {
        setLoading(false);
      }
    };

    if (cardId) {
      fetchCardDetails();
    }
  }, [cardId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#01161e] via-[#0f3460] to-[#01161e] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-[#598392]">Loading card details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#01161e] via-[#0f3460] to-[#01161e] flex items-center justify-center p-4">
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-red-500/20 rounded-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Card Not Found</h2>
          <p className="text-[#598392] mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg hover:from-purple-600 hover:to-purple-800 transition-all duration-200 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#01161e] via-[#0f3460] to-[#01161e] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#598392] hover:text-white transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Go Back
        </button>

        {/* Validity Banner */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-green-400 mb-1">Valid Library Card</h2>
              <p className="text-green-400/80">
                This is an official library card issued by Jashore University of Science and Technology (JUST). 
                The cardholder is authorized to access library facilities and services.
              </p>
            </div>
          </div>
        </div>

        {/* Card Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Column - Personal Information */}
          <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[#598392]/80 text-sm font-medium">Full Name</label>
                <p className="text-white text-lg font-semibold mt-1">{cardData?.name}</p>
              </div>

              <div>
                <label className="text-[#598392]/80 text-sm font-medium">Student ID</label>
                <p className="text-white text-lg font-semibold mt-1">{cardData?.studentID}</p>
              </div>

              <div>
                <label className="text-[#598392]/80 text-sm font-medium">Department</label>
                <p className="text-white text-lg font-semibold mt-1">{cardData?.department}</p>
              </div>

              <div>
                <label className="text-[#598392]/80 text-sm font-medium">Hall Name</label>
                <p className="text-white text-lg font-semibold mt-1">{cardData?.hallName}</p>
              </div>

              <div>
                <label className="text-[#598392]/80 text-sm font-medium">District</label>
                <p className="text-white text-lg font-semibold mt-1">{cardData?.district}</p>
              </div>

              <div>
                <label className="text-[#598392]/80 text-sm font-medium">Blood Group</label>
                <p className="text-white text-lg font-semibold mt-1">{cardData?.bloodGroup}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Card Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <label className="text-[#598392]/80 text-sm font-medium">Email</label>
                    <p className="text-white mt-1">{cardData?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <label className="text-[#598392]/80 text-sm font-medium">Phone Number</label>
                    <p className="text-white mt-1">{cardData?.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <label className="text-[#598392]/80 text-sm font-medium">Emergency Contact</label>
                    <p className="text-white mt-1">{cardData?.emergencyPhoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Status Information */}
            <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Card Status</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[#598392]/80 text-sm font-medium">Status</label>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-white font-semibold capitalize">{cardData?.status}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[#598392]/80 text-sm font-medium">Applied On</label>
                  <p className="text-white mt-1">
                    {new Date(cardData?.appliedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {cardData?.reviewedAt && (
                  <div>
                    <label className="text-[#598392]/80 text-sm font-medium">Approved On</label>
                    <p className="text-white mt-1">
                      {new Date(cardData?.reviewedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}

                {cardData?.approvedBy && (
                  <div className="flex items-start gap-3 pt-2 border-t border-[#598392]/20">
                    <Award className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <label className="text-[#598392]/80 text-sm font-medium">Approved By</label>
                      <p className="text-white mt-1 font-semibold">{cardData?.approvedBy}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Picture */}
        {cardData?.profilePicture && (
          <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-6">Profile Photo</h3>
            <div className="flex justify-center">
              <div className="bg-gray-100 border-2 border-gray-300 rounded-lg overflow-hidden" style={{ width: '280px', height: '320px' }}>
                <img 
                  src={cardData?.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* Authority Badge */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="JUST Logo" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">JUST Authority</h3>
          <p className="text-[#598392] mb-4">
            Jashore University of Science and Technology
          </p>
          <p className="text-[#598392]/70 text-sm">
            This card is issued by the authority of Jashore University of Science and Technology (JUST).
            For verification or inquiries, please contact the library administration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScannedPage;
