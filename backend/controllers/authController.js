import crypto from 'crypto';
import { User } from '../models/User.js';
import { Usage } from '../models/Usage.js';
import { Notification } from '../models/Notification.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';
import { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken } from '../middleware/auth.js';

// Helper function to create and send token
const createSendToken = (user, statusCode, res) => {
  const token = generateToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    refreshToken,
    data: {
      user
    }
  });
};

// Helper function to get usage limits based on subscription
const getUsageLimits = (subscription) => {
  const limits = {
    free: { images: 10, videos: 3, posts: 20 },
    pro: { images: 100, videos: 30, posts: 200 },
    enterprise: { images: 1000, videos: 300, posts: 2000 }
  };
  
  return limits[subscription.plan] || limits.free;
};

// Helper function to create current usage record
const createCurrentUsage = async (userId, subscription) => {
  const limits = getUsageLimits(subscription);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return await Usage.createOrUpdate(userId, 'monthly', monthStart, monthEnd, limits);
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = catchAsync(async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return next(new AppError('User with this email already exists', 400));
  }

  // Create user
  const user = await User.create({
    email,
    password,
    firstName,
    lastName
  });

  // Create usage record
  await createCurrentUsage(user._id, user.subscription);

  // Create welcome notification
  await Notification.createNotification(
    user._id,
    'system',
    'Welcome to Vision-Cast!',
    'Your account has been created successfully. Start creating amazing content with AI!',
    { type: 'welcome' },
    { priority: 'high' }
  );

  // Update login info
  await user.updateLoginInfo();

  createSendToken(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check for user and include password
  const user = await User.findByEmail(email).select('+password');
  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Check if user is active
  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated. Please contact support.', 401));
  }

  // Check if password is correct
  const isPasswordCorrect = await user.correctPassword(password, user.password);
  if (!isPasswordCorrect) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Update login info
  await user.updateLoginInfo();

  createSendToken(user, 200, res);
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = catchAsync(async (req, res, next) => {
  // In a stateless JWT system, logout is handled on the client side
  // by removing the token. However, we can create a notification
  // or log the logout event for security purposes.
  
  await Notification.createNotification(
    req.user._id,
    'system',
    'Logged Out',
    'You have been logged out successfully.',
    { type: 'logout', timestamp: new Date() },
    { priority: 'low' }
  );

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// @desc    Update current user
// @route   PATCH /api/auth/me
// @access  Private
export const updateMe = catchAsync(async (req, res, next) => {
  // Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updatePassword', 400));
  }

  // Filtered out fields that are not allowed to be updated
  const filteredBody = { ...req.body };
  const allowedFields = ['firstName', 'lastName', 'bio', 'website', 'location', 'preferences'];
  Object.keys(filteredBody).forEach(key => {
    if (!allowedFields.includes(key)) {
      delete filteredBody[key];
    }
  });

  // Update user document
  const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// @desc    Update password
// @route   PATCH /api/auth/updatePassword
// @access  Private
export const updatePassword = catchAsync(async (req, res, next) => {
  // Get user from collection
  const user = await User.findById(req.user._id).select('+password');

  // Check if POSTed current password is correct
  const isPasswordCorrect = await user.correctPassword(req.body.currentPassword, user.password);
  if (!isPasswordCorrect) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // If so, update password
  user.password = req.body.newPassword;
  await user.save();

  // Create notification
  await Notification.createNotification(
    user._id,
    'account_update',
    'Password Updated',
    'Your password has been updated successfully.',
    { type: 'password_change', timestamp: new Date() },
    { priority: 'high' }
  );

  // Log user in, send JWT
  createSendToken(user, 200, res);
});

// @desc    Forgot password
// @route   POST /api/auth/forgotPassword
// @access  Public
export const forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on POSTed email
  const user = await User.findByEmail(req.body.email);
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  // Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send it to user's email (implement email service)
  try {
    // TODO: Implement email service
    // const resetURL = `${req.protocol}://${req.get('host')}/api/auth/resetPassword/${resetToken}`;
    // await sendEmail(user.email, 'Password Reset', `Reset your password: ${resetURL}`);

    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent to email',
      resetToken // Remove this in production
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later.', 500));
  }
});

// @desc    Reset password
// @route   PATCH /api/auth/resetPassword/:token
// @access  Public
export const resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Create notification
  await Notification.createNotification(
    user._id,
    'account_update',
    'Password Reset',
    'Your password has been reset successfully.',
    { type: 'password_reset', timestamp: new Date() },
    { priority: 'high' }
  );

  // Log the user in, send JWT
  createSendToken(user, 200, res);
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError('Refresh token is required', 400));
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return next(new AppError('User not found or inactive', 401));
    }

    // Generate new tokens
    const newToken = generateToken({ id: user._id });
    const newRefreshToken = generateRefreshToken({ id: user._id });

    res.status(200).json({
      status: 'success',
      token: newToken,
      refreshToken: newRefreshToken,
      data: {
        user
      }
    });
  } catch (error) {
    return next(new AppError('Invalid refresh token', 401));
  }
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken
  });

  if (!user) {
    return next(new AppError('Invalid verification token', 400));
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  // Create notification
  await Notification.createNotification(
    user._id,
    'account_update',
    'Email Verified',
    'Your email has been verified successfully.',
    { type: 'email_verification', timestamp: new Date() },
    { priority: 'medium' }
  );

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully'
  });
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Private
export const resendVerification = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user.isEmailVerified) {
    return next(new AppError('Email is already verified', 400));
  }

  const verificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // TODO: Implement email service
  // const verificationURL = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
  // await sendEmail(user.email, 'Verify Your Email', `Verify your email: ${verificationURL}`);

  res.status(200).json({
    status: 'success',
    message: 'Verification email sent',
    verificationToken // Remove this in production
  });
});

// @desc    Delete account
// @route   DELETE /api/auth/delete-account
// @access  Private
export const deleteAccount = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Soft delete - deactivate account
  user.isActive = false;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Account deleted successfully'
  });
});
