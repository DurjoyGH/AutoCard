import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const QRcodeComponent = ({ cardId }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const generateQRCode = async () => {
      if (canvasRef.current && cardId) {
        try {
          // Create the URL that will be encoded in the QR code
          const scanUrl = `${window.location.origin}/scan/${cardId}`;
          
          await QRCode.toCanvas(canvasRef.current, scanUrl, {
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
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQRCode();
  }, [cardId]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        width: '120px', 
        height: '120px',
        imageRendering: 'crisp-edges'
      }} 
    />
  );
};

export default QRcodeComponent;
