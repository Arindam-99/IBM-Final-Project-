import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId && !this.facebookId;
      },
    },
    profileImage: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zipCode: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    // Social Login IDs
    googleId: {
      type: String,
      default: null,
    },
    facebookId: {
      type: String,
      default: null,
    },
    // Account verification
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    // Password reset
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    // User preferences
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
      dietary: {
        vegetarian: { type: Boolean, default: false },
        vegan: { type: Boolean, default: false },
        glutenFree: { type: Boolean, default: false },
      },
    },
    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    cartData: { type: Object, default: {} },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ facebookId: 1 });
userSchema.index({ resetPasswordToken: 1 });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
