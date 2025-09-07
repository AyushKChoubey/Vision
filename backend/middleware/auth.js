import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AppError, catchAsync } from './errorHandler.js';

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Generate refresh token
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

// Protect routes - require authentication
export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verification token
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again!', 401));
  }

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id).select('+isActive');
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // 4) Check if user is active
  if (!currentUser.isActive) {
    return next(new AppError('Your account has been deactivated. Please contact support.', 401));
  }

  // 5) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

// Restrict to certain roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = verifyToken(token);
      const currentUser = await User.findById(decoded.id).select('+isActive');
      
      if (currentUser && currentUser.isActive && !currentUser.changedPasswordAfter(decoded.iat)) {
        req.user = currentUser;
      }
    } catch (error) {
      // Token is invalid, but we don't throw error for optional auth
      console.log('Optional auth failed:', error.message);
    }
  }

  next();
});

// Check if user owns resource or is admin
export const checkOwnership = (Model, paramName = 'id') => {
  return catchAsync(async (req, res, next) => {
    const resourceId = req.params[paramName];
    const resource = await Model.findById(resourceId);

    if (!resource) {
      return next(new AppError('Resource not found', 404));
    }

    // Check if user owns the resource or is admin
    if (resource.userId && resource.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('You do not have permission to access this resource', 403));
    }

    req.resource = resource;
    next();
  });
};
