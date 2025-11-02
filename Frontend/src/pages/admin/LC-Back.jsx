import React from 'react';

const LCBack = ({ applicationData }) => {
  // Use provided application data only
  const cardData = {
    contactNumber: applicationData?.phoneNumber ? `+88 ${applicationData.phoneNumber}` : '',
    emergencyContact: applicationData?.emergencyPhoneNumber ? `+88 ${applicationData.emergencyPhoneNumber}` : '',
    homeDistrict: applicationData?.district || '',
    bloodGroup: applicationData?.bloodGroup || ''
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Library Card Back Container */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ aspectRatio: '2.5/3.5' }}>
        <div className="p-6 flex flex-col h-full">
          {/* Contact Information Section */}
          <div className="space-y-1 mb-4">
            <div className="flex items-start">
              <span className="text-gray-800 font-semibold text-sm whitespace-nowrap">
                Card Holder's Contact NO.
              </span>
              <span className="mx-2">:</span>
              <span className="text-gray-800 font-semibold text-sm">
                {cardData.contactNumber}
              </span>
            </div>
            
            <div className="flex items-start">
              <span className="text-gray-800 font-semibold text-sm whitespace-nowrap">
                Emergency Contact No.
              </span>
              <span className="mx-2">:</span>
              <span className="text-gray-800 font-semibold text-sm">
                {cardData.emergencyContact}
              </span>
            </div>
            
            <div className="flex items-start">
              <span className="text-gray-800 font-semibold text-sm">
                Home District:
              </span>
              <span className="ml-2 text-gray-800 font-semibold text-sm">
                {cardData.homeDistrict}
              </span>
            </div>
            
            <div className="flex items-start">
              <span className="text-gray-800 font-semibold text-sm">
                Blood Group:
              </span>
              <span className="ml-2 text-gray-800 font-semibold text-sm">
                {cardData.bloodGroup}
              </span>
            </div>
          </div>

          {/* Librarian's Signature Section */}
          <div className="mb-4">
            <div className="h-12 flex items-center justify-end mb-1">
              {/* Placeholder for signature - can be added dynamically if needed */}
              <div className="text-gray-400 text-xs italic">
                {/* Signature area */}
              </div>
            </div>
            <div className="text-right">
              <p className="text-red-600 font-semibold text-base">
                Librarian's Signature
              </p>
            </div>
          </div>

          {/* Library Building Image */}
          <div className="flex-grow flex items-center justify-center mb-1">
            <div className="w-full">
              <img 
                src="/src/assets/library.jpg"
                alt="Library Building" 
                className="w-full h-40 object-cover rounded-sm"
              />
              <div className="w-full h-px bg-gray-800 mt-2"></div>
            </div>
          </div>

          {/* Return Information Section */}
          <div className="text-center space-y-1">
            <p className="text-gray-800 font-semibold text-sm underline italic">
              If found please return to:
            </p>
            <p className="text-red-600 font-bold text-base leading-tight">
              Librarian, Jashore University of Science and Technology
            </p>
            <p className="text-gray-800 font-medium text-sm">
              Jashore-7408, Bangladesh
            </p>
            <p className="text-gray-800 font-medium text-sm">
              Phone: +88 02-42142053
            </p>
            <p className="text-gray-800 font-medium text-sm">
              Web: www.just.edu.bd
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LCBack;
