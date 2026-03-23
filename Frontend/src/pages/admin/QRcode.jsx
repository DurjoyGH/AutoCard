import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const QRcodeComponent = ({ cardId }) => {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateQRCode = async () => {
      if (cardId) {
        try {
          setIsLoading(true);
          // Create the URL that will be encoded in the QR code
          const scanUrl = `${window.location.origin}/scan/${cardId}`;
          
          // Generate QR code as data URL instead of canvas
          const dataUrl = await QRCode.toDataURL(scanUrl, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.95,
            margin: 0,
            width: 120, // Small size for card corner
            color: {
              dark: '#000000',
              light: '#ffffff',
            },
          });
          
          setQrDataUrl(dataUrl);
          setIsLoading(false);
        } catch (error) {
          console.error('Error generating QR code:', error);
          setIsLoading(false);
        }
      }
    };

    generateQRCode();
  }, [cardId]);

  if (isLoading) {
    return <div style={{ width: '120px', height: '120px', background: '#f0f0f0', borderRadius: '4px' }} />;
  }

  if (!qrDataUrl) {
    return <div style={{ width: '120px', height: '120px', background: '#f0f0f0', borderRadius: '4px' }} />;
  }

  return (
    <img 
      src={qrDataUrl} 
      alt="QR Code" 
      style={{ 
        width: '120px', 
        height: '120px',
        imageRendering: 'crisp-edges',
        display: 'block'
      }} 
    />
  );
};

export default QRcodeComponent;
