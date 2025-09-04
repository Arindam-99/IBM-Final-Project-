import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select('-password -resetPasswordToken -verificationToken');
    
    if (!user) {
      return res.json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        preferences: user.preferences,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error("Get profile error:", error);
    res.json({ 
      success: false, 
      message: "Failed to fetch profile" 
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address, preferences } = req.body;
    const userId = req.user._id;

    const updateData = {};
    
    if (name) updateData.name = name.trim();
    if (phone) updateData.phone = phone.trim();
    if (address) updateData.address = address;
    if (preferences) updateData.preferences = preferences;

    const user = await userModel.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -verificationToken');

    if (!user) {
      return res.json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        preferences: user.preferences
      },
      message: "Profile updated successfully!"
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.json({ 
      success: false, 
      message: "Failed to update profile" 
    });
  }
};

// Upload profile image
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ 
        success: false, 
        message: "No image file provided" 
      });
    }

    const userId = req.user._id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Delete old profile image if exists
    if (user.profileImage) {
      const oldImagePath = path.join(process.cwd(), 'uploads', 'profiles', user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update user with new profile image
    user.profileImage = req.file.filename;
    await user.save();

    res.json({ 
      success: true, 
      profileImage: req.file.filename,
      message: "Profile image updated successfully!"
    });

  } catch (error) {
    console.error("Upload profile image error:", error);
    res.json({ 
      success: false, 
      message: "Failed to upload profile image" 
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return res.json({ 
        success: false, 
        message: "Current password and new password are required" 
      });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.json({
        success: false,
        message: "New password must be at least 8 characters long",
      });
    }

    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // For social login users
    if (!user.password && (user.googleId || user.facebookId)) {
      return res.json({ 
        success: false, 
        message: "Cannot change password for social login accounts" 
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.json({ 
        success: false, 
        message: "Current password is incorrect" 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ 
      success: true, 
      message: "Password changed successfully!"
    });

  } catch (error) {
    console.error("Change password error:", error);
    res.json({ 
      success: false, 
      message: "Failed to change password" 
    });
  }
};

// Delete account
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;

    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // For regular users, verify password
    if (user.password && !user.googleId && !user.facebookId) {
      if (!password) {
        return res.json({ 
          success: false, 
          message: "Password is required to delete account" 
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({ 
          success: false, 
          message: "Incorrect password" 
        });
      }
    }

    // Delete profile image if exists
    if (user.profileImage) {
      const imagePath = path.join(process.cwd(), 'uploads', 'profiles', user.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Soft delete - deactivate account instead of permanent deletion
    user.isActive = false;
    user.email = `deleted_${Date.now()}_${user.email}`;
    await user.save();

    res.json({ 
      success: true, 
      message: "Account deleted successfully"
    });

  } catch (error) {
    console.error("Delete account error:", error);
    res.json({ 
      success: false, 
      message: "Failed to delete account" 
    });
  }
};

export { 
  getUserProfile, 
  updateUserProfile, 
  uploadProfileImage, 
  changePassword, 
  deleteAccount 
};
