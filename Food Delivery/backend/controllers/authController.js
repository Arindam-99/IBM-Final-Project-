import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";
import { generateToken } from "../middleware/auth.js";
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from "../utils/emailService.js";

// Register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Validation
    if (!name || !email || !password) {
      return res.json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.json({ 
        success: false, 
        message: "User already exists with this email" 
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create new user
    const newUser = new userModel({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      verificationToken,
      isVerified: false
    });

    const user = await newUser.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(email, name, verificationToken);
    
    if (!emailSent) {
      console.warn('⚠️ Verification email failed to send, but user was created');
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        profileImage: user.profileImage
      },
      message: "Registration successful! Please check your email to verify your account."
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.json({ 
      success: false, 
      message: "Registration failed. Please try again." 
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Validation
    if (!email || !password) {
      return res.json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // Find user
    const user = await userModel.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (!user) {
      return res.json({ 
        success: false, 
        message: "No account found with this email address" 
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.json({ 
        success: false, 
        message: "Your account has been deactivated. Please contact support." 
      });
    }

    // For social login users without password
    if (!user.password && (user.googleId || user.facebookId)) {
      return res.json({ 
        success: false, 
        message: "Please use social login (Google/Facebook) for this account" 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        profileImage: user.profileImage,
        phone: user.phone,
        address: user.address
      },
      message: "Login successful!"
    });

  } catch (error) {
    console.error("Login error:", error);
    res.json({ 
      success: false, 
      message: "Login failed. Please try again." 
    });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  const { token } = req.body;
  
  try {
    if (!token) {
      return res.json({ 
        success: false, 
        message: "Verification token is required" 
      });
    }

    // Find user with verification token
    const user = await userModel.findOne({ verificationToken: token });
    
    if (!user) {
      return res.json({ 
        success: false, 
        message: "Invalid or expired verification token" 
      });
    }

    if (user.isVerified) {
      return res.json({ 
        success: false, 
        message: "Email is already verified" 
      });
    }

    // Verify user
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    res.json({ 
      success: true, 
      message: "Email verified successfully! Welcome to Ari's Restaurant!" 
    });

  } catch (error) {
    console.error("Email verification error:", error);
    res.json({ 
      success: false, 
      message: "Email verification failed. Please try again." 
    });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    if (!email) {
      return res.json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    // Find user
    const user = await userModel.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (!user) {
      return res.json({ 
        success: false, 
        message: "No account found with this email address" 
      });
    }

    // For social login users
    if (!user.password && (user.googleId || user.facebookId)) {
      return res.json({ 
        success: false, 
        message: "This account uses social login. Please use Google/Facebook to sign in." 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Send reset email
    const emailSent = await sendPasswordResetEmail(user.email, user.name, resetToken);
    
    if (!emailSent) {
      return res.json({ 
        success: false, 
        message: "Failed to send reset email. Please try again." 
      });
    }

    res.json({ 
      success: true, 
      message: "Password reset email sent! Please check your inbox." 
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.json({ 
      success: false, 
      message: "Failed to process password reset. Please try again." 
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  
  try {
    if (!token || !newPassword) {
      return res.json({ 
        success: false, 
        message: "Reset token and new password are required" 
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Find user with valid reset token
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.json({ 
        success: false, 
        message: "Invalid or expired reset token" 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ 
      success: true, 
      message: "Password reset successful! You can now login with your new password." 
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.json({ 
      success: false, 
      message: "Password reset failed. Please try again." 
    });
  }
};

export { 
  registerUser, 
  loginUser, 
  verifyEmail, 
  forgotPassword, 
  resetPassword 
};
