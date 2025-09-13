import { Post } from '../models/Post.js';
import { Creation } from '../models/Creation.js';
import { Usage } from '../models/Usage.js';
import { Analytics } from '../models/Analytics.js';
import { Notification } from '../models/Notification.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { creationId, platform, content, scheduledAt } = req.body;

  // Check if creation exists and belongs to user
  const creation = await Creation.findById(creationId);
  if (!creation) {
    return next(new AppError('Creation not found', 404));
  }

  if (creation.userId.toString() !== userId.toString()) {
    return next(new AppError('You do not have permission to post this creation', 403));
  }

  if (creation.status !== 'completed') {
    return next(new AppError('Creation is not ready for posting', 400));
  }

  // Get or create usage record for analytics (but don't enforce limits)
  let currentUsage = await Usage.findCurrent(userId);
  if (!currentUsage) {
    // Create a new usage record if it doesn't exist
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    currentUsage = await Usage.create({
      userId,
      period: 'monthly',
      startDate: startOfMonth,
      endDate: endOfMonth,
      imagesGenerated: 0,
      videosGenerated: 0,
      postsCreated: 0,
      limits: {
        images: 999999,
        videos: 999999,
        posts: 999999
      }
    });
  }

  // No limit check - unlimited posting allowed

  // Validate scheduled date
  if (scheduledAt && new Date(scheduledAt) <= new Date()) {
    return next(new AppError('Scheduled date must be in the future', 400));
  }

  // Create post
  const post = await Post.create({
    userId,
    creationId,
    platform,
    content,
    scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    status: scheduledAt ? 'scheduled' : 'draft'
  });

  // Increment usage
  await currentUsage.incrementUsage('posts');

  // Create analytics record
  await Analytics.create({
    userId,
    type: 'post',
    entityId: post._id,
    entityType: 'Post',
    metrics: {
      platform,
      status: post.status,
      scheduledAt: post.scheduledAt
    }
  });

  // Create notification
  const notificationType = scheduledAt ? 'post_scheduled' : 'system';
  const notificationTitle = scheduledAt ? 'Post Scheduled' : 'Post Created';
  const notificationMessage = scheduledAt 
    ? `Your post has been scheduled for ${new Date(scheduledAt).toLocaleString()}`
    : 'Your post has been created and is ready to be published';

  await Notification.createNotification(
    userId,
    notificationType,
    notificationTitle,
    notificationMessage,
    { postId: post._id, platform, creationId },
    { priority: 'medium' }
  );

  res.status(201).json({
    status: 'success',
    data: {
      post
    }
  });
});

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
export const getPosts = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { page = 1, limit = 20, platform, status, sort = '-createdAt' } = req.query;
  
  const skip = (page - 1) * limit;
  
  let query = { userId };
  if (platform) query.platform = platform;
  if (status) query.status = status;

  const posts = await Post.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('creationId', 'title type thumbnailUrl fileUrl')
    .populate('userId', 'firstName lastName avatar');

  const total = await Post.countDocuments(query);

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

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
export const getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate('creationId', 'title type thumbnailUrl fileUrl')
    .populate('userId', 'firstName lastName avatar');

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  // Check ownership
  if (post.userId._id.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to view this post', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      post
    }
  });
});

// @desc    Update post
// @route   PATCH /api/posts/:id
// @access  Private
export const updatePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  // Check ownership
  if (post.userId.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to update this post', 403));
  }

  // Don't allow updates to published posts
  if (post.status === 'posted') {
    return next(new AppError('Cannot update published posts', 400));
  }

  const allowedFields = ['content', 'scheduledAt'];
  const filteredBody = {};
  
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredBody[key] = req.body[key];
    }
  });

  // Validate scheduled date
  if (filteredBody.scheduledAt && new Date(filteredBody.scheduledAt) <= new Date()) {
    return next(new AppError('Scheduled date must be in the future', 400));
  }

  // Update status based on scheduled date
  if (filteredBody.scheduledAt) {
    filteredBody.status = 'scheduled';
  } else if (post.status === 'scheduled' && !filteredBody.scheduledAt) {
    filteredBody.status = 'draft';
  }

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      post: updatedPost
    }
  });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  // Check ownership
  if (post.userId.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to delete this post', 403));
  }

  // Don't allow deletion of published posts
  if (post.status === 'posted') {
    return next(new AppError('Cannot delete published posts', 400));
  }

  await Post.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Post deleted successfully'
  });
});

// @desc    Publish post immediately
// @route   POST /api/posts/:id/publish
// @access  Private
export const publishPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  // Check ownership
  if (post.userId.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to publish this post', 403));
  }

  if (post.status === 'posted') {
    return next(new AppError('Post is already published', 400));
  }

  // Simulate publishing to social media platform
  try {
    // In a real app, this would call the social media API
    const platformPostId = `platform_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Update post status
    await Post.findByIdAndUpdate(req.params.id, {
      status: 'posted',
      postedAt: new Date(),
      platformPostId
    });

    // Create analytics record
    await Analytics.create({
      userId: req.user._id,
      type: 'post',
      entityId: post._id,
      entityType: 'Post',
      metrics: {
        action: 'publish',
        platform: post.platform,
        timestamp: new Date(),
        success: true
      }
    });

    // Create notification
    await Notification.createNotification(
      req.user._id,
      'post_published',
      'Post Published',
      `Your post has been published on ${post.platform}!`,
      { postId: post._id, platform: post.platform, platformPostId },
      { priority: 'medium' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Post published successfully',
      data: {
        platformPostId
      }
    });
  } catch (error) {
    // Update post status to failed
    await Post.findByIdAndUpdate(req.params.id, {
      status: 'failed'
    });

    // Create failure notification
    await Notification.createNotification(
      req.user._id,
      'system',
      'Post Failed',
      `Failed to publish your post on ${post.platform}. Please try again.`,
      { postId: post._id, platform: post.platform },
      { priority: 'high' }
    );

    return next(new AppError('Failed to publish post. Please try again.', 500));
  }
});

// @desc    Get scheduled posts
// @route   GET /api/posts/scheduled
// @access  Private
export const getScheduledPosts = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { page = 1, limit = 20 } = req.query;
  
  const skip = (page - 1) * limit;

  const posts = await Post.find({
    userId,
    status: 'scheduled',
    scheduledAt: { $gt: new Date() }
  })
    .sort({ scheduledAt: 1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('creationId', 'title type thumbnailUrl');

  const total = await Post.countDocuments({
    userId,
    status: 'scheduled',
    scheduledAt: { $gt: new Date() }
  });

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

// @desc    Update post engagement
// @route   PATCH /api/posts/:id/engagement
// @access  Private
export const updatePostEngagement = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  // Check ownership
  if (post.userId.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to update this post', 403));
  }

  const { engagement } = req.body;
  
  if (!engagement || typeof engagement !== 'object') {
    return next(new AppError('Invalid engagement data', 400));
  }

  await post.updateEngagement(engagement);

  res.status(200).json({
    status: 'success',
    data: {
      post
    }
  });
});

// @desc    Get post statistics
// @route   GET /api/posts/stats
// @access  Private
export const getPostStats = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { period = 'monthly', startDate, endDate } = req.query;

  const stats = await Post.getStats(userId);
  const analytics = await Analytics.getAggregated(userId, 'post', period, startDate, endDate);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
      analytics
    }
  });
});
