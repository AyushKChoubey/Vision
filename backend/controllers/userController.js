import { User } from '../models/User.js';
import { Creation } from '../models/Creation.js';
import { Post } from '../models/Post.js';
import { Usage } from '../models/Usage.js';
import { Analytics } from '../models/Analytics.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = catchAsync(async (req, res, next) => {
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

// @desc    Update user profile
// @route   PATCH /api/users/profile
// @access  Private
export const updateProfile = catchAsync(async (req, res, next) => {
  const allowedFields = ['firstName', 'lastName', 'bio', 'website', 'location', 'preferences'];
  const filteredBody = {};
  
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredBody[key] = req.body[key];
    }
  });

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

// @desc    Upload user avatar
// @route   POST /api/users/avatar
// @access  Private
export const uploadAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload an image file', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.file.path },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
export const getDashboard = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  // Get user's creations
  const creations = await Creation.findByUser(userId, { status: 'completed' });
  
  // Get user's posts
  const posts = await Post.findByUser(userId);
  
  // Get current usage
  const currentUsage = await Usage.findCurrent(userId);
  
  // Get analytics summary
  const analyticsSummary = await Analytics.getSummary(userId);
  
  // Get recent activity
  const recentCreations = await Creation.findByUser(userId)
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('userId', 'firstName lastName avatar');
  
  const recentPosts = await Post.findByUser(userId)
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('creationId', 'title type thumbnailUrl');

  // Calculate statistics
  const stats = {
    totalCreations: creations.length,
    totalPosts: posts.length,
    imagesCreated: creations.filter(c => c.type === 'image').length,
    videosCreated: creations.filter(c => c.type === 'video').length,
    postsThisMonth: posts.filter(p => {
      const postDate = new Date(p.createdAt);
      const now = new Date();
      return postDate.getMonth() === now.getMonth() && 
             postDate.getFullYear() === now.getFullYear();
    }).length,
    scheduledPosts: posts.filter(p => p.status === 'scheduled').length,
    engagementRate: posts.length > 0 ? 
      (posts.reduce((sum, p) => sum + p.totalEngagement, 0) / posts.length).toFixed(1) : 0
  };

  res.status(200).json({
    status: 'success',
    data: {
      stats,
      usage: currentUsage,
      analytics: analyticsSummary,
      recentCreations,
      recentPosts
    }
  });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { period = 'monthly', startDate, endDate } = req.query;

  // Get creation statistics
  const creationStats = await Creation.getStats(userId);
  
  // Get post statistics
  const postStats = await Post.getStats(userId);
  
  // Get usage statistics
  const usageStats = await Usage.getStats(userId, startDate, endDate);
  
  // Get analytics data
  const analyticsData = await Analytics.getAggregated(userId, 'creation', period, startDate, endDate);

  res.status(200).json({
    status: 'success',
    data: {
      creations: creationStats,
      posts: postStats,
      usage: usageStats,
      analytics: analyticsData
    }
  });
});

// @desc    Get user activity
// @route   GET /api/users/activity
// @access  Private
export const getUserActivity = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { page = 1, limit = 20, type } = req.query;
  
  const skip = (page - 1) * limit;
  
  let query = { userId };
  if (type) {
    query.type = type;
  }

  const activities = await Analytics.findByUser(userId, { type })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Analytics.countDocuments(query);

  res.status(200).json({
    status: 'success',
    data: {
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get user settings
// @route   GET /api/users/settings
// @access  Private
export const getUserSettings = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('preferences subscription role');
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      preferences: user.preferences,
      subscription: user.subscription,
      role: user.role
    }
  });
});

// @desc    Update user settings
// @route   PATCH /api/users/settings
// @access  Private
export const updateUserSettings = catchAsync(async (req, res, next) => {
  const allowedFields = ['preferences'];
  const filteredBody = {};
  
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredBody[key] = req.body[key];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      preferences: user.preferences
    }
  });
});

// @desc    Get user's creations
// @route   GET /api/users/creations
// @access  Private
export const getUserCreations = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { page = 1, limit = 20, type, status } = req.query;
  
  const skip = (page - 1) * limit;
  
  const options = {};
  if (type) options.type = type;
  if (status) options.status = status;

  const creations = await Creation.findByUser(userId, options)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Creation.countDocuments({ userId, ...options });

  res.status(200).json({
    status: 'success',
    data: {
      creations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get user's posts
// @route   GET /api/users/posts
// @access  Private
export const getUserPosts = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { page = 1, limit = 20, platform, status } = req.query;
  
  const skip = (page - 1) * limit;
  
  const options = {};
  if (platform) options.platform = platform;
  if (status) options.status = status;

  const posts = await Post.findByUser(userId, options)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('creationId', 'title type thumbnailUrl');

  const total = await Post.countDocuments({ userId, ...options });

  res.status(200).json({
    status: 'success',
    data: {
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
export const deleteUserAccount = catchAsync(async (req, res, next) => {
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
