import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send verification email
export const sendVerificationEmail = async (email, name, verificationToken) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: `"Ari's Restaurant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - Ari\'s Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🍽️ Ari's Restaurant</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333;">Welcome ${name}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for signing up with Ari's Restaurant. To complete your registration, 
              please verify your email address by clicking the button below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 25px; font-weight: bold; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:
              <br><a href="${verificationUrl}" style="color: #667eea;">${verificationUrl}</a>
            </p>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you didn't create an account, please ignore this email.
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
            <p>© 2024 Ari's Restaurant. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent to:', email);
    return true;
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"Ari's Restaurant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset - Ari\'s Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🔐 Password Reset</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333;">Hi ${name},</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password for your Ari's Restaurant account. 
              Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
                        color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 25px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:
              <br><a href="${resetUrl}" style="color: #ef4444;">${resetUrl}</a>
            </p>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              <strong>This link will expire in 1 hour.</strong>
            </p>
            
            <p style="color: #666; font-size: 14px;">
              If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
            <p>© 2024 Ari's Restaurant. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent to:', email);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return false;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Ari's Restaurant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Ari\'s Restaurant! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🎉 Welcome to Ari's Restaurant!</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333;">Hi ${name}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Welcome to Ari's Restaurant family! Your email has been verified successfully. 
              You can now enjoy our delicious food delivery service.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>🍽️ Browse our delicious menu</li>
                <li>🛒 Add items to your cart</li>
                <li>🚚 Enjoy fast delivery to your doorstep</li>
                <li>⭐ Rate and review your favorite dishes</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}" 
                 style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                        color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 25px; font-weight: bold; display: inline-block;">
                Start Ordering Now
              </a>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
            <p>© 2024 Ari's Restaurant. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', email);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return false;
  }
};
