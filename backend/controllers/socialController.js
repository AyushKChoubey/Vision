import { SocialAccount } from '../models/SocialAccount.js';
import { Analytics } from '../models/Analytics.js';
import { Notification } from '../models/Notification.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';

// @desc    Connect social media account
// @route   POST /api/social/connect
// @access  Private
export const connectSocialAccount = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { platform, accessToken, refreshToken, platformUserId, platformUsername, profileData } = req.body;

  // Check if account already exists
  const existingAccount = await SocialAccount.findByPlatform(userId, platform);
  if (existingAccount) {
    return next(new AppError('Account already connected for this platform', 400));
  }

  // Create social account
  const socialAccount = await SocialAccount.create({
    userId,
    platform,
    accessToken,
    refreshToken,
    platformUserId,
    platformUsername,
    profileData,
    isActive: true
  });

  // Create analytics record
  await Analytics.create({
    userId,
    type: 'platform_usage',
    entityId: socialAccount._id,
    entityType: 'SocialAccount',
    metrics: {
      action: 'connect',
      platform,
      timestamp: new Date(),
      success: true
    }
  });

  // Create notification
  await Notification.createNotification(
    userId,
    'account_update',
    'Social Account Connected',
    `Your ${platform} account has been connected successfully!`,
    { platform, accountId: socialAccount._id },
    { priority: 'medium' }
  );

  res.status(201).json({
    status: 'success',
    data: {
      socialAccount
    }
  });
});

// @desc    Get connected social accounts
// @route   GET /api/social/accounts
// @access  Private
export const getSocialAccounts = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { platform, isActive } = req.query;

  const options = {};
  if (platform) options.platform = platform;
  if (isActive !== undefined) options.isActive = isActive === 'true';

  const accounts = await SocialAccount.findByUser(userId, options);

  res.status(200).json({
    status: 'success',
    data: {
      accounts
    }
  });
});

// @desc    Get single social account
// @route   GET /api/social/accounts/:id
// @access  Private
export const getSocialAccount = catchAsync(async (req, res, next) => {
  const account = await SocialAccount.findById(req.params.id);

  if (!account) {
    return next(new AppError('Social account not found', 404));
  }

  // Check ownership
  if (account.userId.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to view this account', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      account
    }
  });
});

// @desc    Update social account
// @route   PATCH /api/social/accounts/:id
// @access  Private
export const updateSocialAccount = catchAsync(async (req, res, next) => {
  const account = await SocialAccount.findById(req.params.id);

  if (!account) {
    return next(new AppError('Social account not found', 404));
  }

  // Check ownership
  if (account.userId.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to update this account', 403));
  }

  const allowedFields = ['profileData', 'isActive'];
  const filteredBody = {};
  
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredBody[key] = req.body[key];
    }
  });

  const updatedAccount = await SocialAccount.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      account: updatedAccount
    }
  });
});

// @desc    Disconnect social account
// @route   DELETE /api/social/accounts/:id
// @access  Private
export const disconnectSocialAccount = catchAsync(async (req, res, next) => {
  const account = await SocialAccount.findById(req.params.id);

  if (!account) {
    return next(new AppError('Social account not found', 404));
  }

  // Check ownership
  if (account.userId.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to disconnect this account', 403));
  }

  // Deactivate account instead of deleting
  await account.deactivate();

  // Create analytics record
  await Analytics.create({
    userId: req.user._id,
    type: 'platform_usage',
    entityId: account._id,
    entityType: 'SocialAccount',
    metrics: {
      action: 'disconnect',
      platform: account.platform,
      timestamp: new Date(),
      success: true
    }
  });

  // Create notification
  await Notification.createNotification(
    req.user._id,
    'account_update',
    'Social Account Disconnected',
    `Your ${account.platform} account has been disconnected.`,
    { platform: account.platform, accountId: account._id },
    { priority: 'medium' }
  );

  res.status(200).json({
    status: 'success',
    message: 'Social account disconnected successfully'
  });
});

// @desc    Sync social account data
// @route   POST /api/social/accounts/:id/sync
// @access  Private
export const syncSocialAccount = catchAsync(async (req, res, next) => {
  const account = await SocialAccount.findById(req.params.id);

  if (!account) {
    return next(new AppError('Social account not found', 404));
  }

  // Check ownership
  if (account.userId.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to sync this account', 403));
  }

  if (!account.isActive) {
    return next(new AppError('Account is not active', 400));
  }

  try {
    // In a real app, this would call the social media API to get updated data
    const updatedProfileData = {
      ...account.profileData,
      followers: Math.floor(Math.random() * 10000) + 1000,
      following: Math.floor(Math.random() * 1000) + 100,
      posts: Math.floor(Math.random() * 500) + 50,
      lastSyncAt: new Date()
    };

    await account.updateProfileData(updatedProfileData);

    // Create analytics record
    await Analytics.create({
      userId: req.user._id,
      type: 'platform_usage',
      entityId: account._id,
      entityType: 'SocialAccount',
      metrics: {
        action: 'sync',
        platform: account.platform,
        timestamp: new Date(),
        success: true
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Account synced successfully',
      data: {
        account
      }
    });
  } catch (error) {
    // Create analytics record for failed sync
    await Analytics.create({
      userId: req.user._id,
      type: 'platform_usage',
      entityId: account._id,
      entityType: 'SocialAccount',
      metrics: {
        action: 'sync',
        platform: account.platform,
        timestamp: new Date(),
        success: false,
        error: error.message
      }
    });

    return next(new AppError('Failed to sync account data', 500));
  }
});

// @desc    Get social account statistics
// @route   GET /api/social/stats
// @access  Private
export const getSocialStats = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { period = 'monthly', startDate, endDate } = req.query;

  const stats = await SocialAccount.getStats(userId);
  const analytics = await Analytics.getAggregated(userId, 'platform_usage', period, startDate, endDate);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
      analytics
    }
  });
});

// @desc    Get platform insights
// @route   GET /api/social/insights/:platform
// @access  Private
export const getPlatformInsights = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { platform } = req.params;
  const { startDate, endDate } = req.query;

  const account = await SocialAccount.findByPlatform(userId, platform);
  if (!account) {
    return next(new AppError('Account not connected for this platform', 404));
  }

  // Get analytics for this platform
  const analytics = await Analytics.findByEntity(account._id, 'SocialAccount', {
    type: 'platform_usage',
    startDate,
    endDate
  });

  // Simulate platform insights (in real app, this would come from platform API)
  const insights = {
    platform,
    account: {
      username: account.platformUsername,
      followers: account.profileData.followers,
      following: account.profileData.following,
      posts: account.profileData.posts
    },
    engagement: {
      avgLikes: Math.floor(Math.random() * 100) + 50,
      avgComments: Math.floor(Math.random() * 20) + 5,
      avgShares: Math.floor(Math.random() * 10) + 2,
      engagementRate: (Math.random() * 5 + 2).toFixed(2)
    },
    bestTimes: [
      { day: 'Monday', time: '9:00 AM', engagement: 85 },
      { day: 'Tuesday', time: '2:00 PM', engagement: 92 },
      { day: 'Wednesday', time: '7:00 PM', engagement: 78 },
      { day: 'Thursday', time: '11:00 AM', engagement: 88 },
      { day: 'Friday', time: '5:00 PM', engagement: 95 }
    ],
    topContent: [
      { type: 'image', engagement: 95 },
      { type: 'video', engagement: 87 },
      { type: 'carousel', engagement: 82 }
    ]
  };

  res.status(200).json({
    status: 'success',
    data: {
      insights,
      analytics
    }
  });
});
