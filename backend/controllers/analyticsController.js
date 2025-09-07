import { Analytics } from '../models/Analytics.js';
import { Creation } from '../models/Creation.js';
import { Post } from '../models/Post.js';
import { Usage } from '../models/Usage.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';

// @desc    Get analytics overview
// @route   GET /api/analytics/overview
// @access  Private
export const getAnalyticsOverview = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { period = 'monthly', startDate, endDate } = req.query;

  // Get creation analytics
  const creationAnalytics = await Analytics.getAggregated(userId, 'creation', period, startDate, endDate);
  
  // Get post analytics
  const postAnalytics = await Analytics.getAggregated(userId, 'post', period, startDate, endDate);
  
  // Get usage analytics
  const usageAnalytics = await Analytics.getAggregated(userId, 'user_activity', period, startDate, endDate);

  // Get summary statistics
  const summary = await Analytics.getSummary(userId, startDate, endDate);

  // Calculate key metrics
  const totalCreations = await Creation.countDocuments({ userId, status: 'completed' });
  const totalPosts = await Post.countDocuments({ userId });
  const currentUsage = await Usage.findCurrent(userId);

  const overview = {
    period,
    dateRange: { startDate, endDate },
    summary,
    metrics: {
      totalCreations,
      totalPosts,
      usage: currentUsage,
      engagement: {
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        avgEngagementRate: 0
      }
    },
    analytics: {
      creations: creationAnalytics,
      posts: postAnalytics,
      usage: usageAnalytics
    }
  };

  res.status(200).json({
    status: 'success',
    data: overview
  });
});

// @desc    Get creation analytics
// @route   GET /api/analytics/creations
// @access  Private
export const getCreationAnalytics = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { period = 'monthly', startDate, endDate, groupBy = 'date' } = req.query;

  const analytics = await Analytics.getAggregated(userId, 'creation', period, startDate, endDate);
  
  // Get top metrics
  const topStyles = await Analytics.getTopMetrics(userId, 'creation', 'style', 5);
  const topModels = await Analytics.getTopMetrics(userId, 'creation', 'model', 5);

  // Get creation statistics
  const creationStats = await Creation.getStats(userId);

  res.status(200).json({
    status: 'success',
    data: {
      analytics,
      topStyles,
      topModels,
      stats: creationStats
    }
  });
});

// @desc    Get post analytics
// @route   GET /api/analytics/posts
// @access  Private
export const getPostAnalytics = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { period = 'monthly', startDate, endDate } = req.query;

  const analytics = await Analytics.getAggregated(userId, 'post', period, startDate, endDate);
  
  // Get top platforms
  const topPlatforms = await Analytics.getTopMetrics(userId, 'post', 'platform', 5);
  
  // Get post statistics
  const postStats = await Post.getStats(userId);

  // Get engagement metrics
  const posts = await Post.findByUser(userId);
  const engagementMetrics = {
    totalLikes: posts.reduce((sum, post) => sum + post.engagement.likes, 0),
    totalComments: posts.reduce((sum, post) => sum + post.engagement.comments, 0),
    totalShares: posts.reduce((sum, post) => sum + post.engagement.shares, 0),
    totalViews: posts.reduce((sum, post) => sum + post.engagement.views, 0),
    avgEngagementRate: posts.length > 0 ? 
      (posts.reduce((sum, post) => sum + post.engagementRate, 0) / posts.length).toFixed(2) : 0
  };

  res.status(200).json({
    status: 'success',
    data: {
      analytics,
      topPlatforms,
      stats: postStats,
      engagement: engagementMetrics
    }
  });
});

// @desc    Get usage analytics
// @route   GET /api/analytics/usage
// @access  Private
export const getUsageAnalytics = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { period = 'monthly', startDate, endDate } = req.query;

  const analytics = await Analytics.getAggregated(userId, 'user_activity', period, startDate, endDate);
  
  // Get usage statistics
  const usageStats = await Usage.getStats(userId, startDate, endDate);
  
  // Get current usage
  const currentUsage = await Usage.findCurrent(userId);

  res.status(200).json({
    status: 'success',
    data: {
      analytics,
      stats: usageStats,
      current: currentUsage
    }
  });
});

// @desc    Get platform analytics
// @route   GET /api/analytics/platforms
// @access  Private
export const getPlatformAnalytics = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { period = 'monthly', startDate, endDate } = req.query;

  const analytics = await Analytics.getAggregated(userId, 'platform_usage', period, startDate, endDate);
  
  // Get platform statistics
  const platformStats = await Analytics.getStats(userId, startDate, endDate);

  res.status(200).json({
    status: 'success',
    data: {
      analytics,
      stats: platformStats
    }
  });
});

// @desc    Get analytics by entity
// @route   GET /api/analytics/entity/:entityType/:entityId
// @access  Private
export const getEntityAnalytics = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { entityType, entityId } = req.params;
  const { startDate, endDate } = req.query;

  // Validate entity type
  const validEntityTypes = ['Creation', 'Post', 'SocialAccount'];
  if (!validEntityTypes.includes(entityType)) {
    return next(new AppError('Invalid entity type', 400));
  }

  const analytics = await Analytics.findByEntity(entityId, entityType, {
    startDate,
    endDate
  });

  res.status(200).json({
    status: 'success',
    data: {
      entityType,
      entityId,
      analytics
    }
  });
});

// @desc    Get analytics trends
// @route   GET /api/analytics/trends
// @access  Private
export const getAnalyticsTrends = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { period = 'monthly', startDate, endDate, type } = req.query;

  const trends = {};

  if (!type || type === 'creations') {
    trends.creations = await Analytics.getAggregated(userId, 'creation', period, startDate, endDate);
  }

  if (!type || type === 'posts') {
    trends.posts = await Analytics.getAggregated(userId, 'post', period, startDate, endDate);
  }

  if (!type || type === 'usage') {
    trends.usage = await Analytics.getAggregated(userId, 'user_activity', period, startDate, endDate);
  }

  if (!type || type === 'platforms') {
    trends.platforms = await Analytics.getAggregated(userId, 'platform_usage', period, startDate, endDate);
  }

  res.status(200).json({
    status: 'success',
    data: {
      period,
      dateRange: { startDate, endDate },
      trends
    }
  });
});

// @desc    Get analytics export
// @route   GET /api/analytics/export
// @access  Private
export const exportAnalytics = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { format = 'json', startDate, endDate } = req.query;

  // Get all analytics data
  const analytics = await Analytics.findByUser(userId, { startDate, endDate });
  
  // Get related data
  const creations = await Creation.findByUser(userId);
  const posts = await Post.findByUser(userId);
  const usage = await Usage.findByUser(userId, { startDate, endDate });

  const exportData = {
    exportDate: new Date().toISOString(),
    dateRange: { startDate, endDate },
    data: {
      analytics,
      creations,
      posts,
      usage
    }
  };

  if (format === 'csv') {
    // TODO: Implement CSV export
    res.status(200).json({
      status: 'success',
      message: 'CSV export not yet implemented',
      data: exportData
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: exportData
    });
  }
});
