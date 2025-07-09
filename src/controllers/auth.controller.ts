import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.model';
import { sendPasswordResetEmail } from '../services/email.service';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({
        success: false,
        message: 'User already exists',
      });
      return;
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
    });

    // Generate tokens
    const accessToken = user.getSignedJwtToken();
    const refreshToken = user.getRefreshToken();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Send response
    sendTokenResponse(user, accessToken, refreshToken, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
      return;
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Generate tokens
    const accessToken = user.getSignedJwtToken();
    const refreshToken = user.getRefreshToken();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Send response
    sendTokenResponse(user, accessToken, refreshToken, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Please provide refresh token',
      });
      return;
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as { id: string };

      // Get user
      const user = await User.findById(decoded.id);

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid token',
        });
        return;
      }

      // Generate new access token
      const accessToken = user.getSignedJwtToken();

      res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire
    const resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    // Update user
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken,
      resetPasswordExpire,
    });

    // Send email
    try {
      await sendPasswordResetEmail(email, resetToken);

      res.status(200).json({
        success: true,
        message: 'Password reset email sent',
      });
    } catch (error) {
      console.error('Email error:', error);

      // Remove reset token fields
      await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: undefined,
        resetPasswordExpire: undefined,
      });

      res.status(500).json({
        success: false,
        message: 'Email could not be sent',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide token and password',
      });
      return;
    }

    // Hash token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired token',
      });
      return;
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { firstName, lastName, email } = req.body;

    // Build update object
    const updateFields: { firstName?: string; lastName?: string; email?: string } = {};
    
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (email) updateFields.email = email;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Check if passwords are provided
    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
      return;
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Check if current password matches
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
      return;
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to send token response
const sendTokenResponse = (
  user: any,
  accessToken: string,
  refreshToken: string,
  statusCode: number,
  res: Response
): void => {
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
    refreshToken,
  });
};