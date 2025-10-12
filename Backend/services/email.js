const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    },
    secure: true,
    tls: {
      rejectUnauthorized: false
    }
  });
};

const getVerificationEmailTemplate = (userName, verificationToken) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Verification - Library Card Generator</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #e0e0e0;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #7f8c8d;
                font-size: 14px;
            }
            .verification-code {
                background-color: #f8f9fa;
                border: 2px dashed #3498db;
                padding: 20px;
                text-align: center;
                margin: 30px 0;
                border-radius: 8px;
            }
            .code {
                font-size: 32px;
                font-weight: bold;
                color: #2c3e50;
                letter-spacing: 5px;
                font-family: 'Courier New', monospace;
            }
            .instructions {
                background-color: #e8f4f8;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #3498db;
                margin: 20px 0;
            }
            .warning {
                background-color: #fff3cd;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #ffc107;
                margin: 20px 0;
                font-size: 14px;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                color: #7f8c8d;
                font-size: 12px;
            }
            .btn {
                display: inline-block;
                padding: 12px 30px;
                background-color: #3498db;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Library Card Generator</div>
                <div class="subtitle">Digital Library Services</div>
            </div>
            
            <h2 style="color: #2c3e50; margin-bottom: 20px;">Account Verification Required</h2>
            
            <p>Dear ${userName},</p>
            
            <p>Thank you for registering with Library Card Generator. To complete your account setup and start accessing our digital library services, please verify your email address using the verification code below.</p>
            
            <div class="verification-code">
                <p style="margin: 0; color: #7f8c8d; font-size: 14px;">Your Verification Code</p>
                <div class="code">${verificationToken}</div>
            </div>
            
            <div class="instructions">
                <h3 style="margin-top: 0; color: #2c3e50;">How to verify your account:</h3>
                <ol style="margin: 10px 0;">
                    <li>Copy the 5-digit verification code above</li>
                    <li>Return to the Library Card Generator application</li>
                    <li>Enter this code in the verification form</li>
                    <li>Click "Verify Account" to complete the process</li>
                </ol>
            </div>
            
            <div class="warning">
                <strong>Note:</strong> This verification code will expire in 5 minutes for security reasons. If you do not verify within this time, you will need to request a new code.
            </div>
            
            <p style="color: #555;">Once verified, you will be able to:</p>
            <ul style="color: #555;">
                <li>Apply for your digital library card</li>
                <li>Access library resources</li>
                <li>Manage your library profile</li>
                <li>Track your applications</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <p style="color: #7f8c8d;">Need help? Contact our support team</p>
            </div>
            
            <div class="footer">
                <p>This email was sent to verify your account with Library Card Generator.</p>
                <p>If you didn't create an account, please ignore this email.</p>
                <p style="margin-top: 15px;">
                    <strong>Library Card Generator</strong><br>
                    Digital Library Services<br>
                    Email: ${process.env.EMAIL}
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const getWelcomeEmailTemplate = (userName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Library Card Generator</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .success-badge {
                background-color: #d4edda;
                color: #155724;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
                margin: 20px 0;
                border: 1px solid #c3e6cb;
            }
            .next-steps {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="color: #2c3e50;">Welcome to Library Card Generator</h1>
            </div>
            
            <div class="success-badge">
                <h2 style="margin: 0;">Account Verified Successfully</h2>
                <p style="margin: 10px 0 0 0;">Your email has been verified and your account is now active.</p>
            </div>
            
            <p>Dear ${userName},</p>
            <p>Congratulations! Your account has been successfully verified. You can now access all the features of our Library Card Generator platform.</p>
            
            <div class="next-steps">
                <h3 style="color: #2c3e50; margin-top: 0;">What's Next?</h3>
                <ul>
                    <li>Complete your profile information</li>
                    <li>Apply for your digital library card</li>
                    <li>Explore available library resources</li>
                    <li>Set up your preferences</li>
                </ul>
            </div>
            
            <p>If you have any questions or need assistance, don't hesitate to contact our support team.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <p style="color: #7f8c8d;">Thank you for choosing Library Card Generator!</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const sendVerificationEmail = async (userEmail, userName, verificationToken) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Library Card Generator',
        address: process.env.EMAIL
      },
      to: userEmail,
      subject: 'Account Verification - Library Card Generator',
      html: getVerificationEmailTemplate(userName, verificationToken),
      text: `Hello ${userName},\n\nThank you for registering with Library Card Generator. Your verification code is: ${verificationToken}\n\nThis code will expire in 5 minutes.\n\nBest regards,\nLibrary Card Generator Team`,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'Library Card Generator System v1.0',
        'Reply-To': process.env.EMAIL,
        'Return-Path': process.env.EMAIL,
        'List-Unsubscribe': '<mailto:' + process.env.EMAIL + '?subject=unsubscribe>',
        'X-Auto-Response-Suppress': 'All'
      },
      messageId: `verification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@librarygen.com`
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Library Card Generator',
        address: process.env.EMAIL
      },
      to: userEmail,
      subject: 'Welcome to Library Card Generator',
      html: getWelcomeEmailTemplate(userName),
      text: `Hello ${userName},\n\nWelcome to Library Card Generator! Your account has been successfully verified.\n\nYou can now:\n- Complete your profile\n- Apply for your digital library card\n- Access library resources\n\nThank you for joining us!\n\nBest regards,\nLibrary Card Generator Team`,
      headers: {
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'normal',
        'X-Mailer': 'Library Card Generator System v1.0',
        'Reply-To': process.env.EMAIL,
        'Return-Path': process.env.EMAIL,
        'List-Unsubscribe': '<mailto:' + process.env.EMAIL + '?subject=unsubscribe>',
        'X-Auto-Response-Suppress': 'All'
      },
      messageId: `welcome-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@librarygen.com`
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

const sendPasswordResetEmail = async (userEmail, userName, resetToken) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Library Card Generator',
        address: process.env.EMAIL
      },
      to: userEmail,
      subject: '🔑 Password Reset Request - Library Card Generator',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Hello ${userName},</p>
          <p>You requested a password reset. Your reset code is: <strong>${resetToken}</strong></p>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail
};