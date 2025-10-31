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

const sendApplicationApprovedEmail = async (userEmail, userName, application) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Library Card Generator',
        address: process.env.EMAIL
      },
      to: userEmail,
      subject: '🎉 Library Card Application Approved!',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Application Approved</title>
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
                    border-bottom: 2px solid #e0e0e0;
                }
                .success-badge {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    margin: 20px 0;
                }
                .success-icon {
                    font-size: 48px;
                    margin-bottom: 10px;
                }
                .card-info {
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #28a745;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #e0e0e0;
                }
                .info-row:last-child {
                    border-bottom: none;
                }
                .label {
                    font-weight: bold;
                    color: #555;
                }
                .value {
                    color: #2c3e50;
                }
                .next-steps {
                    background-color: #e8f4f8;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #3498db;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #e0e0e0;
                    color: #7f8c8d;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="color: #2c3e50; margin: 0;">Library Card Generator</h1>
                    <p style="color: #7f8c8d; margin: 5px 0 0 0;">Digital Library Services</p>
                </div>
                
                <div class="success-badge">
                    <div class="success-icon">✅</div>
                    <h2 style="margin: 0 0 10px 0;">Congratulations!</h2>
                    <p style="margin: 0; font-size: 16px;">Your Library Card Application Has Been Approved</p>
                </div>
                
                <p>Dear ${userName},</p>
                
                <p>We are pleased to inform you that your library card application has been <strong>approved</strong>! Your digital library card is now active and ready to use.</p>
                
                <div class="card-info">
                    <h3 style="margin-top: 0; color: #2c3e50;">Application Details</h3>
                    <div class="info-row">
                        <span class="label">Application ID:</span>
                        <span class="value">${application._id}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Student ID:</span>
                        <span class="value">${application.studentID}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Hall Name:</span>
                        <span class="value">${application.hallName}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Status:</span>
                        <span class="value" style="color: #28a745; font-weight: bold;">APPROVED</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Reviewed On:</span>
                        <span class="value">${new Date(application.reviewedAt).toLocaleDateString()}</span>
                    </div>
                </div>
                
                <div class="next-steps">
                    <h3 style="margin-top: 0; color: #2c3e50;">What's Next?</h3>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Your digital library card is now active</li>
                        <li>You can access all library resources and services</li>
                        <li>Download your library card from your profile</li>
                        <li>Present your card when borrowing books</li>
                        <li>Keep your profile information up to date</li>
                    </ul>
                </div>
                
                <p>Thank you for choosing our library services. We look forward to serving you!</p>
                
                <p style="margin-top: 30px;">If you have any questions, please don't hesitate to contact us.</p>
                
                <div class="footer">
                    <p><strong>Library Card Generator</strong><br>
                    Digital Library Services<br>
                    Email: ${process.env.EMAIL}</p>
                    <p style="margin-top: 10px;">This is an automated message. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `Dear ${userName},\n\nCongratulations! Your library card application has been APPROVED.\n\nApplication Details:\n- Application ID: ${application._id}\n- Student ID: ${application.studentID}\n- Hall Name: ${application.hallName}\n- Status: APPROVED\n- Reviewed On: ${new Date(application.reviewedAt).toLocaleDateString()}\n\nYour digital library card is now active and ready to use.\n\nBest regards,\nLibrary Card Generator Team`,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'Library Card Generator System v1.0',
        'Reply-To': process.env.EMAIL,
      }
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Application approval email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending application approval email:', error);
    return { success: false, error: error.message };
  }
};

const sendApplicationRejectedEmail = async (userEmail, userName, application, rejectionReason) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Library Card Generator',
        address: process.env.EMAIL
      },
      to: userEmail,
      subject: 'Library Card Application Update - Action Required',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Application Update</title>
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
                    border-bottom: 2px solid #e0e0e0;
                }
                .warning-badge {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    margin: 20px 0;
                }
                .warning-icon {
                    font-size: 48px;
                    margin-bottom: 10px;
                }
                .reason-box {
                    background-color: #fff3cd;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #ffc107;
                }
                .card-info {
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #e0e0e0;
                }
                .info-row:last-child {
                    border-bottom: none;
                }
                .label {
                    font-weight: bold;
                    color: #555;
                }
                .value {
                    color: #2c3e50;
                }
                .next-steps {
                    background-color: #e8f4f8;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #3498db;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #e0e0e0;
                    color: #7f8c8d;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="color: #2c3e50; margin: 0;">Library Card Generator</h1>
                    <p style="color: #7f8c8d; margin: 5px 0 0 0;">Digital Library Services</p>
                </div>
                
                <div class="warning-badge">
                    <div class="warning-icon">📋</div>
                    <h2 style="margin: 0 0 10px 0;">Application Update Required</h2>
                    <p style="margin: 0; font-size: 16px;">Your Library Card Application Needs Attention</p>
                </div>
                
                <p>Dear ${userName},</p>
                
                <p>Thank you for submitting your library card application. After careful review, we regret to inform you that your application could not be approved at this time.</p>
                
                <div class="reason-box">
                    <h3 style="margin-top: 0; color: #856404;">Reason for Rejection</h3>
                    <p style="margin: 10px 0; color: #856404; font-size: 15px;"><strong>${rejectionReason}</strong></p>
                </div>
                
                <div class="card-info">
                    <h3 style="margin-top: 0; color: #2c3e50;">Application Details</h3>
                    <div class="info-row">
                        <span class="label">Application ID:</span>
                        <span class="value">${application._id}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Student ID:</span>
                        <span class="value">${application.studentID}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Hall Name:</span>
                        <span class="value">${application.hallName}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Status:</span>
                        <span class="value" style="color: #dc3545; font-weight: bold;">REJECTED</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Reviewed On:</span>
                        <span class="value">${new Date(application.reviewedAt).toLocaleDateString()}</span>
                    </div>
                </div>
                
                <div class="next-steps">
                    <h3 style="margin-top: 0; color: #2c3e50;">What You Can Do Next</h3>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Review the rejection reason carefully</li>
                        <li>Correct the mentioned issues in your application</li>
                        <li>Ensure all required documents are clear and valid</li>
                        <li>Submit a new application with the corrections</li>
                        <li>Contact support if you need assistance</li>
                    </ul>
                </div>
                
                <p>We encourage you to address the concerns mentioned above and resubmit your application. Our team is here to help you through the process.</p>
                
                <p style="margin-top: 30px;">If you have any questions or need clarification, please feel free to contact us.</p>
                
                <div class="footer">
                    <p><strong>Library Card Generator</strong><br>
                    Digital Library Services<br>
                    Email: ${process.env.EMAIL}</p>
                    <p style="margin-top: 10px;">This is an automated message. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `Dear ${userName},\n\nYour library card application has been reviewed and could not be approved at this time.\n\nReason for Rejection:\n${rejectionReason}\n\nApplication Details:\n- Application ID: ${application._id}\n- Student ID: ${application.studentID}\n- Hall Name: ${application.hallName}\n- Status: REJECTED\n- Reviewed On: ${new Date(application.reviewedAt).toLocaleDateString()}\n\nPlease address the concerns mentioned and submit a new application.\n\nBest regards,\nLibrary Card Generator Team`,
      headers: {
        'X-Priority': '2',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'normal',
        'X-Mailer': 'Library Card Generator System v1.0',
        'Reply-To': process.env.EMAIL,
      }
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Application rejection email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending application rejection email:', error);
    return { success: false, error: error.message };
  }
};

const sendNewAdminEmail = async (userEmail, userName, password) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Library Card Generator',
        address: process.env.EMAIL
      },
      to: userEmail,
      subject: '🎉 Welcome to Library Card Generator - Admin Access Granted',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Account Created</title>
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
                    border-bottom: 2px solid #e0e0e0;
                }
                .logo {
                    font-size: 28px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 10px;
                }
                .welcome-badge {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    margin: 20px 0;
                }
                .welcome-icon {
                    font-size: 48px;
                    margin-bottom: 10px;
                }
                .credentials-box {
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #764ba2;
                }
                .credential-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 0;
                    border-bottom: 1px solid #e0e0e0;
                }
                .credential-row:last-child {
                    border-bottom: none;
                }
                .label {
                    font-weight: bold;
                    color: #555;
                }
                .value {
                    color: #2c3e50;
                    font-family: 'Courier New', monospace;
                    background-color: #e8f4f8;
                    padding: 4px 8px;
                    border-radius: 4px;
                }
                .security-warning {
                    background-color: #fff3cd;
                    padding: 15px;
                    border-radius: 8px;
                    border-left: 4px solid #ffc107;
                    margin: 20px 0;
                    font-size: 14px;
                }
                .admin-features {
                    background-color: #e8f4f8;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #3498db;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #e0e0e0;
                    color: #7f8c8d;
                    font-size: 12px;
                }
                .btn {
                    display: inline-block;
                    padding: 12px 30px;
                    background-color: #764ba2;
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
                    <p style="color: #7f8c8d; margin: 5px 0 0 0;">Digital Library Services</p>
                </div>
                
                <div class="welcome-badge">
                    <div class="welcome-icon">👑</div>
                    <h2 style="margin: 0 0 10px 0;">Welcome to the Admin Team!</h2>
                    <p style="margin: 0; font-size: 16px;">You've been granted administrator access</p>
                </div>
                
                <p>Dear ${userName},</p>
                
                <p>Congratulations! An administrator has created an admin account for you in the Library Card Generator system. You now have full administrative privileges to manage the platform.</p>
                
                <div class="credentials-box">
                    <h3 style="margin-top: 0; color: #2c3e50;">Your Login Credentials</h3>
                    <div class="credential-row">
                        <span class="label">Email:</span>
                        <span class="value">${userEmail}</span>
                    </div>
                    <div class="credential-row">
                        <span class="label">Password:</span>
                        <span class="value">${password}</span>
                    </div>
                    <div class="credential-row">
                        <span class="label">Role:</span>
                        <span class="value">Administrator</span>
                    </div>
                    <div class="credential-row">
                        <span class="label">Status:</span>
                        <span class="value" style="background-color: #d4edda; color: #155724;">✓ Verified</span>
                    </div>
                </div>
                
                <div class="security-warning">
                    <strong>⚠️ Important Security Notice:</strong>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Please change your password immediately after your first login</li>
                        <li>Keep your credentials secure and confidential</li>
                        <li>Never share your admin password with anyone</li>
                        <li>Use a strong, unique password for your account</li>
                    </ul>
                </div>
                
                <div class="admin-features">
                    <h3 style="margin-top: 0; color: #2c3e50;">As an Administrator, you can:</h3>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>View and manage all registered users</li>
                        <li>Review and approve library card applications</li>
                        <li>Reject applications with detailed feedback</li>
                        <li>Delete users and applications</li>
                        <li>Create new administrator accounts</li>
                        <li>Access comprehensive dashboard analytics</li>
                        <li>Send automated email notifications</li>
                        <li>Monitor system activities and statistics</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p style="margin-bottom: 15px;">Ready to get started?</p>
                    <p style="color: #7f8c8d; font-size: 14px;">Login at: <strong>${process.env.FRONTEND_URL || 'http://localhost:5173'}/login</strong></p>
                </div>
                
                <p>If you have any questions about your admin privileges or need assistance, please contact the system administrator.</p>
                
                <div class="footer">
                    <p><strong>Library Card Generator</strong><br>
                    Digital Library Services<br>
                    Email: ${process.env.EMAIL}</p>
                    <p style="margin-top: 10px;">This is an automated message. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `Dear ${userName},\n\nCongratulations! You've been granted administrator access to the Library Card Generator system.\n\nYour Login Credentials:\n- Email: ${userEmail}\n- Password: ${password}\n- Role: Administrator\n- Status: Verified\n\nIMPORTANT: Please change your password immediately after your first login.\n\nAs an administrator, you can:\n- View and manage all users\n- Review and approve library card applications\n- Delete users and applications\n- Create new administrator accounts\n- Access comprehensive dashboard analytics\n\nLogin at: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/login\n\nBest regards,\nLibrary Card Generator Team`,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'Library Card Generator System v1.0',
        'Reply-To': process.env.EMAIL,
      }
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('New admin email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending new admin email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendApplicationApprovedEmail,
  sendApplicationRejectedEmail,
  sendNewAdminEmail
};