import userModel from "../models/userModel.js";
import { generateToken } from "../middleware/auth.js";
import { sendWelcomeEmail } from "../utils/emailService.js";

// Google OAuth callback
const googleAuth = async (req, res) => {
  try {
    const { googleId, email, name, picture } = req.body;

    if (!googleId || !email || !name) {
      return res.json({
        success: false,
        message: "Missing required Google authentication data"
      });
    }

    // Check if user exists with Google ID
    let user = await userModel.findOne({ googleId });

    if (user) {
      // Update last login
      user.lastLogin = new Date();
      if (picture && !user.profileImage) {
        user.profileImage = picture;
      }
      await user.save();
    } else {
      // Check if user exists with same email
      const existingUser = await userModel.findOne({ 
        email: email.toLowerCase().trim() 
      });

      if (existingUser) {
        // Link Google account to existing user
        existingUser.googleId = googleId;
        existingUser.lastLogin = new Date();
        if (picture && !existingUser.profileImage) {
          existingUser.profileImage = picture;
        }
        if (!existingUser.isVerified) {
          existingUser.isVerified = true;
          existingUser.verificationToken = null;
        }
        user = await existingUser.save();
      } else {
        // Create new user
        user = new userModel({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          googleId,
          profileImage: picture || null,
          isVerified: true,
          lastLogin: new Date()
        });
        
        await user.save();
        
        // Send welcome email
        await sendWelcomeEmail(user.email, user.name);
      }
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
        profileImage: user.profileImage,
        phone: user.phone,
        address: user.address
      },
      message: "Google authentication successful!"
    });

  } catch (error) {
    console.error("Google auth error:", error);
    res.json({
      success: false,
      message: "Google authentication failed. Please try again."
    });
  }
};

// Facebook OAuth callback
const facebookAuth = async (req, res) => {
  try {
    const { facebookId, email, name, picture } = req.body;

    if (!facebookId || !name) {
      return res.json({
        success: false,
        message: "Missing required Facebook authentication data"
      });
    }

    // Check if user exists with Facebook ID
    let user = await userModel.findOne({ facebookId });

    if (user) {
      // Update last login
      user.lastLogin = new Date();
      if (picture && !user.profileImage) {
        user.profileImage = picture;
      }
      await user.save();
    } else {
      // Check if user exists with same email (if email provided)
      let existingUser = null;
      if (email) {
        existingUser = await userModel.findOne({ 
          email: email.toLowerCase().trim() 
        });
      }

      if (existingUser) {
        // Link Facebook account to existing user
        existingUser.facebookId = facebookId;
        existingUser.lastLogin = new Date();
        if (picture && !existingUser.profileImage) {
          existingUser.profileImage = picture;
        }
        if (!existingUser.isVerified) {
          existingUser.isVerified = true;
          existingUser.verificationToken = null;
        }
        user = await existingUser.save();
      } else {
        // Create new user
        const userData = {
          name: name.trim(),
          facebookId,
          profileImage: picture || null,
          isVerified: true,
          lastLogin: new Date()
        };

        // Add email if provided
        if (email) {
          userData.email = email.toLowerCase().trim();
        } else {
          // Generate a placeholder email for Facebook users without email
          userData.email = `facebook_${facebookId}@placeholder.com`;
        }

        user = new userModel(userData);
        await user.save();
        
        // Send welcome email if real email provided
        if (email && !email.includes('placeholder.com')) {
          await sendWelcomeEmail(user.email, user.name);
        }
      }
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email.includes('placeholder.com') ? null : user.email,
        isVerified: user.isVerified,
        profileImage: user.profileImage,
        phone: user.phone,
        address: user.address
      },
      message: "Facebook authentication successful!"
    });

  } catch (error) {
    console.error("Facebook auth error:", error);
    res.json({
      success: false,
      message: "Facebook authentication failed. Please try again."
    });
  }
};

// Link social account to existing user
const linkSocialAccount = async (req, res) => {
  try {
    const { provider, socialId, email, name, picture } = req.body;
    const userId = req.user._id;

    if (!provider || !socialId || !['google', 'facebook'].includes(provider)) {
      return res.json({
        success: false,
        message: "Invalid social provider"
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    // Check if social account is already linked to another user
    const query = provider === 'google' ? { googleId: socialId } : { facebookId: socialId };
    const existingSocialUser = await userModel.findOne(query);

    if (existingSocialUser && existingSocialUser._id.toString() !== userId.toString()) {
      return res.json({
        success: false,
        message: `This ${provider} account is already linked to another user`
      });
    }

    // Link social account
    if (provider === 'google') {
      user.googleId = socialId;
    } else {
      user.facebookId = socialId;
    }

    // Update profile image if not set
    if (picture && !user.profileImage) {
      user.profileImage = picture;
    }

    // Verify email if not verified
    if (!user.isVerified) {
      user.isVerified = true;
      user.verificationToken = null;
    }

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        profileImage: user.profileImage,
        googleId: user.googleId,
        facebookId: user.facebookId
      },
      message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} account linked successfully!`
    });

  } catch (error) {
    console.error("Link social account error:", error);
    res.json({
      success: false,
      message: "Failed to link social account"
    });
  }
};

// Unlink social account
const unlinkSocialAccount = async (req, res) => {
  try {
    const { provider } = req.body;
    const userId = req.user._id;

    if (!provider || !['google', 'facebook'].includes(provider)) {
      return res.json({
        success: false,
        message: "Invalid social provider"
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user has password or other social login
    const hasPassword = user.password;
    const hasOtherSocial = provider === 'google' ? user.facebookId : user.googleId;

    if (!hasPassword && !hasOtherSocial) {
      return res.json({
        success: false,
        message: "Cannot unlink the only login method. Please set a password first."
      });
    }

    // Unlink social account
    if (provider === 'google') {
      user.googleId = null;
    } else {
      user.facebookId = null;
    }

    await user.save();

    res.json({
      success: true,
      message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} account unlinked successfully!`
    });

  } catch (error) {
    console.error("Unlink social account error:", error);
    res.json({
      success: false,
      message: "Failed to unlink social account"
    });
  }
};

export { 
  googleAuth, 
  facebookAuth, 
  linkSocialAccount, 
  unlinkSocialAccount 
};
