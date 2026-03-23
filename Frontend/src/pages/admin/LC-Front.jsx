import React from 'react';
import QRcodeComponent from './QRcode';

const LCFront = ({ applicationData }) => {
  // Use provided application data only
  const cardData = {
    id: applicationData?.id || '',
    photo: applicationData?.profilePicture || '',
    name: applicationData?.name || '',
    roll: applicationData?.studentID || '',
    department: applicationData?.department || '',
    hall: applicationData?.hallName || '',
    signature: applicationData?.signature || ''
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Library Card Container */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ aspectRatio: '2.5/3.5' }}>
          {/* Card Header */}
          <div className="bg-white pt-6 pb-4 px-6">
            {/* Logo */}
            <div className="flex justify-center mb-3">
              <img 
                src="/logo.png" 
                alt="JUST Logo" 
                className="h-20 w-20 object-contain"
              />
            </div>
            
            {/* University Name */}
            <div className="text-center">
              <h1 className="text-gray-800 font-bold text-lg leading-tight mb-1">
                Jashore University of Science and Technology
              </h1>
              <h2 className="text-red-600 font-bold text-xl tracking-wide">
                Library Card
              </h2>
            </div>
          </div>

          {/* Card Body */}
          <div className="px-6 pb-6">
            {/* Photo Section */}
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 border-2 border-gray-200 rounded-sm overflow-hidden" style={{ width: '180px', height: '210px' }}>
                <img 
                  src={cardData.photo} 
                  alt="Student Photo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Student Information */}
            <div className="space-y-1 flex flex-col items-center">
              <h3 className="text-gray-900 font-bold text-xl tracking-wide text-center">
                {cardData.name}
              </h3>
              <p className="text-gray-800 font-semibold text-base text-center">
                Roll: {cardData.roll} Dept: {cardData.department}
              </p>
              <p className="text-gray-800 font-semibold text-base text-center">
                Hall: {cardData.hall}
              </p>
            </div>

            {/* Signature Section */}
            <div className="mt-6 mb-2">
              <div className="flex justify-end mb-1 mr-4">
                <div className="h-16 flex items-center justify-end">
                  <img 
                    src={cardData.signature} 
                    alt="Signature" 
                    className="h-full object-contain"
                    style={{ filter: 'grayscale(100%)' }}
                  />
                </div>
              </div>
              <div className="text-right mr-4">
                <p className="text-gray-700 font-serif text-base italic">
                  Holder's Signature
                </p>
              </div>
            </div>

            {/* QR Code at bottom left */}
            {cardData.id && (
              <div className="mt-6 ml-4">
                <QRcodeComponent cardId={cardData.id} />
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default LCFront;
