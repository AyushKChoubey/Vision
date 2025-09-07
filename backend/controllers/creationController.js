import { Creation } from '../models/Creation.js';
import { Usage } from '../models/Usage.js';
import { Analytics } from '../models/Analytics.js';
import { Notification } from '../models/Notification.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Create new creation
// @route   POST /api/creations
// @access  Private
export const createCreation = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { type, title, description, prompt, style, size, duration, quality } = req.body;

  // Check usage limits
  const currentUsage = await Usage.findCurrent(userId);
  if (!currentUsage) {
    return next(new AppError('Usage record not found', 404));
  }

  const usageType = type === 'image' ? 'images' : 'videos';
  if (currentUsage.isLimitExceeded(usageType)) {
    return next(new AppError(`You have reached your ${usageType} generation limit for this period`, 403));
  }

  // Create creation record
  const creation = await Creation.create({
    userId,
    type,
    title,
    description,
    prompt,
    style,
    size,
    duration,
    quality
  });

  // Increment usage
  await currentUsage.incrementUsage(usageType);

  // Create analytics record
  await Analytics.create({
    userId,
    type: 'creation',
    entityId: creation._id,
    entityType: 'Creation',
    metrics: {
      generationTime: 0,
      fileSize: 0,
      status: 'generating',
      model: 'VisionCast AI',
      style,
      quality
    }
  });

  // Simulate AI generation (in real app, this would call AI service)
  setTimeout(async () => {
    try {
      // Simulate generation time
      const generationTime = Math.random() * 5 + 1; // 1-6 seconds
      
      // Simulate file URL (in real app, this would be from AI service)
      const fileUrl = `https://picsum.photos/${size || '1024/1024'}?random=${Date.now()}`;
      const thumbnailUrl = fileUrl;
      
      // Update creation
      await Creation.findByIdAndUpdate(creation._id, {
        status: 'completed',
        fileUrl,
        thumbnailUrl,
        fileSize: Math.floor(Math.random() * 5000000) + 1000000, // 1-6MB
        generationTime,
        model: 'VisionCast AI Pro'
      });

      // Update analytics
      await Analytics.findOneAndUpdate(
        { entityId: creation._id, type: 'creation' },
        {
          'metrics.generationTime': generationTime,
          'metrics.fileSize': Math.floor(Math.random() * 5000000) + 1000000,
          'metrics.status': 'completed'
        }
      );

      // Create notification
      await Notification.createNotification(
        userId,
        'generation_complete',
        `${type === 'image' ? 'Image' : 'Video'} Generation Complete`,
        `Your ${type} "${title}" has been generated successfully!`,
        { creationId: creation._id, type, title },
        { priority: 'medium' }
      );
    } catch (error) {
      console.error('Generation simulation error:', error);
      
      // Update creation status to failed
      await Creation.findByIdAndUpdate(creation._id, {
        status: 'failed'
      });

      // Create failure notification
      await Notification.createNotification(
        userId,
        'system',
        'Generation Failed',
        `Failed to generate your ${type}. Please try again.`,
        { creationId: creation._id, type, title },
        { priority: 'high' }
      );
    }
  }, 3000); // 3 second delay

  res.status(201).json({
    status: 'success',
    data: {
      creation
    }
  });
});

// @desc    Get all creations
// @route   GET /api/creations
// @access  Private
export const getCreations = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { page = 1, limit = 20, type, status, sort = '-createdAt' } = req.query;
  
  const skip = (page - 1) * limit;
  
  let query = { userId };
  if (type) query.type = type;
  if (status) query.status = status;

  const creations = await Creation.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('userId', 'firstName lastName avatar');

  const total = await Creation.countDocuments(query);

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

// @desc    Get single creation
// @route   GET /api/creations/:id
// @access  Private
export const getCreation = catchAsync(async (req, res, next) => {
  const creation = await Creation.findById(req.params.id)
    .populate('userId', 'firstName lastName avatar');

  if (!creation) {
    return next(new AppError('Creation not found', 404));
  }

  // Check if user owns this creation or if it's public
  if (creation.userId._id.toString() !== req.user._id.toString() && !creation.isPublic) {
    return next(new AppError('You do not have permission to view this creation', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      creation
    }
  });
});

// @desc    Update creation
// @route   PATCH /api/creations/:id
// @access  Private
export const updateCreation = catchAsync(async (req, res, next) => {
  const creation = await Creation.findById(req.params.id);

  if (!creation) {
    return next(new AppError('Creation not found', 404));
  }

  // Check ownership
  if (creation.userId.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to update this creation', 403));
  }

  const allowedFields = ['title', 'description', 'tags', 'isPublic'];
  const filteredBody = {};
  
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredBody[key] = req.body[key];
    }
  });

  const updatedCreation = await Creation.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      creation: updatedCreation
    }
  });
});

// @desc    Delete creation
// @route   DELETE /api/creations/:id
// @access  Private
export const deleteCreation = catchAsync(async (req, res, next) => {
  const creation = await Creation.findById(req.params.id);

  if (!creation) {
    return next(new AppError('Creation not found', 404));
  }

  // Check ownership
  if (creation.userId.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to delete this creation', 403));
  }

  // Delete file from cloudinary if exists
  if (creation.fileUrl) {
    try {
      // Extract public ID from URL
      const publicId = creation.fileUrl.split('/').pop().split('.')[0];
      await deleteFromCloudinary(publicId);
    } catch (error) {
      console.error('Error deleting file from cloudinary:', error);
    }
  }

  // Soft delete - mark as deleted
  creation.status = 'deleted';
  await creation.save();

  res.status(200).json({
    status: 'success',
    message: 'Creation deleted successfully'
  });
});

// @desc    Download creation
// @route   GET /api/creations/:id/download
// @access  Private
export const downloadCreation = catchAsync(async (req, res, next) => {
  const creation = await Creation.findById(req.params.id);

  if (!creation) {
    return next(new AppError('Creation not found', 404));
  }

  // Check if user owns this creation or if it's public
  if (creation.userId.toString() !== req.user._id.toString() && !creation.isPublic) {
    return next(new AppError('You do not have permission to download this creation', 403));
  }

  if (creation.status !== 'completed') {
    return next(new AppError('Creation is not ready for download', 400));
  }

  // Increment download count
  await creation.incrementDownloadCount();

  // Create analytics record
  await Analytics.create({
    userId: req.user._id,
    type: 'creation',
    entityId: creation._id,
    entityType: 'Creation',
    metrics: {
      action: 'download',
      timestamp: new Date(),
      success: true
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      downloadUrl: creation.fileUrl,
      filename: `${creation.title}.${creation.metadata?.format || 'jpg'}`
    }
  });
});

// @desc    Get public creations
// @route   GET /api/creations/public
// @access  Public
export const getPublicCreations = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, type, tags, sort = '-createdAt' } = req.query;
  
  const skip = (page - 1) * limit;
  
  const options = {};
  if (type) options.type = type;
  if (tags) options.tags = tags.split(',');

  const creations = await Creation.findPublic(options)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('userId', 'firstName lastName avatar');

  const total = await Creation.countDocuments({ isPublic: true, status: 'completed', ...options });

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

// @desc    Get creation statistics
// @route   GET /api/creations/stats
// @access  Private
export const getCreationStats = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { period = 'monthly', startDate, endDate } = req.query;

  const stats = await Creation.getStats(userId);
  const analytics = await Analytics.getAggregated(userId, 'creation', period, startDate, endDate);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
      analytics
    }
  });
});
