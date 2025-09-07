import { Template } from '../models/Template.js';
import { Analytics } from '../models/Analytics.js';
import { Notification } from '../models/Notification.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';

// @desc    Create new template
// @route   POST /api/templates
// @access  Private
export const createTemplate = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { name, description, type, category, prompt, style, settings, tags, isPublic, metadata } = req.body;

  // Create template
  const template = await Template.create({
    userId,
    name,
    description,
    type,
    category,
    prompt,
    style,
    settings,
    tags,
    isPublic,
    metadata
  });

  // Create analytics record
  await Analytics.create({
    userId,
    type: 'user_activity',
    entityId: template._id,
    entityType: 'Template',
    metrics: {
      action: 'create',
      templateType: type,
      category,
      timestamp: new Date(),
      success: true
    }
  });

  // Create notification
  await Notification.createNotification(
    userId,
    'system',
    'Template Created',
    `Your template "${name}" has been created successfully!`,
    { templateId: template._id, name, type, category },
    { priority: 'low' }
  );

  res.status(201).json({
    status: 'success',
    data: {
      template
    }
  });
});

// @desc    Get all templates
// @route   GET /api/templates
// @access  Private
export const getTemplates = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { page = 1, limit = 20, type, category, isPublic, sort = '-createdAt' } = req.query;
  
  const skip = (page - 1) * limit;
  
  let query = { userId };
  if (type) query.type = type;
  if (category) query.category = category;
  if (isPublic !== undefined) query.isPublic = isPublic === 'true';

  const templates = await Template.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('userId', 'firstName lastName avatar');

  const total = await Template.countDocuments(query);

  res.status(200).json({
    status: 'success',
    data: {
      templates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get single template
// @route   GET /api/templates/:id
// @access  Private
export const getTemplate = catchAsync(async (req, res, next) => {
  const template = await Template.findById(req.params.id)
    .populate('userId', 'firstName lastName avatar');

  if (!template) {
    return next(new AppError('Template not found', 404));
  }

  // Check if user owns this template or if it's public
  if (template.userId._id.toString() !== req.user._id.toString() && !template.isPublic) {
    return next(new AppError('You do not have permission to view this template', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      template
    }
  });
});

// @desc    Update template
// @route   PATCH /api/templates/:id
// @access  Private
export const updateTemplate = catchAsync(async (req, res, next) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    return next(new AppError('Template not found', 404));
  }

  // Check ownership
  if (template.userId.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to update this template', 403));
  }

  const allowedFields = ['name', 'description', 'prompt', 'style', 'settings', 'tags', 'isPublic', 'metadata'];
  const filteredBody = {};
  
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredBody[key] = req.body[key];
    }
  });

  const updatedTemplate = await Template.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      template: updatedTemplate
    }
  });
});

// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private
export const deleteTemplate = catchAsync(async (req, res, next) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    return next(new AppError('Template not found', 404));
  }

  // Check ownership
  if (template.userId.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to delete this template', 403));
  }

  await Template.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Template deleted successfully'
  });
});

// @desc    Use template
// @route   POST /api/templates/:id/use
// @access  Private
export const useTemplate = catchAsync(async (req, res, next) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    return next(new AppError('Template not found', 404));
  }

  // Check if user owns this template or if it's public
  if (template.userId.toString() !== req.user._id.toString() && !template.isPublic) {
    return next(new AppError('You do not have permission to use this template', 403));
  }

  const { variables = {} } = req.body;

  // Process prompt with variables
  const processedPrompt = template.processPrompt(variables);

  // Increment usage count
  await template.incrementUsage();

  // Create analytics record
  await Analytics.create({
    userId: req.user._id,
    type: 'user_activity',
    entityId: template._id,
    entityType: 'Template',
    metrics: {
      action: 'use',
      templateType: template.type,
      category: template.category,
      variables,
      timestamp: new Date(),
      success: true
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      processedPrompt,
      template: {
        id: template._id,
        name: template.name,
        type: template.type,
        style: template.style,
        settings: template.settings
      }
    }
  });
});

// @desc    Get public templates
// @route   GET /api/templates/public
// @access  Public
export const getPublicTemplates = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, type, category, tags, sort = '-usageCount' } = req.query;
  
  const skip = (page - 1) * limit;
  
  const options = {};
  if (type) options.type = type;
  if (category) options.category = category;
  if (tags) options.tags = tags.split(',');

  const templates = await Template.findPublic(options)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('userId', 'firstName lastName avatar');

  const total = await Template.countDocuments({ isPublic: true, ...options });

  res.status(200).json({
    status: 'success',
    data: {
      templates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Search templates
// @route   GET /api/templates/search
// @access  Private
export const searchTemplates = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { q, page = 1, limit = 20, type, category, isPublic } = req.query;
  
  if (!q) {
    return next(new AppError('Search query is required', 400));
  }

  const skip = (page - 1) * limit;
  
  const options = {};
  if (type) options.type = type;
  if (category) options.category = category;
  if (isPublic !== undefined) options.isPublic = isPublic === 'true';

  const templates = await Template.search(q, options)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('userId', 'firstName lastName avatar');

  const total = await Template.countDocuments({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { prompt: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } }
    ],
    ...options
  });

  res.status(200).json({
    status: 'success',
    data: {
      templates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get popular templates
// @route   GET /api/templates/popular
// @access  Public
export const getPopularTemplates = catchAsync(async (req, res, next) => {
  const { limit = 10, type, category } = req.query;

  const options = {};
  if (type) options.type = type;
  if (category) options.category = category;

  const templates = await Template.findPopular(parseInt(limit))
    .populate('userId', 'firstName lastName avatar');

  res.status(200).json({
    status: 'success',
    data: {
      templates
    }
  });
});

// @desc    Get template statistics
// @route   GET /api/templates/stats
// @access  Private
export const getTemplateStats = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const stats = await Template.getStats(userId);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

// @desc    Add template variable
// @route   POST /api/templates/:id/variables
// @access  Private
export const addTemplateVariable = catchAsync(async (req, res, next) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    return next(new AppError('Template not found', 404));
  }

  // Check ownership
  if (template.userId.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to modify this template', 403));
  }

  const { name, type, defaultValue, options, required, description } = req.body;

  if (!name || !type) {
    return next(new AppError('Variable name and type are required', 400));
  }

  const variable = {
    name,
    type,
    defaultValue,
    options,
    required,
    description
  };

  await template.addVariable(variable);

  res.status(200).json({
    status: 'success',
    data: {
      template
    }
  });
});

// @desc    Remove template variable
// @route   DELETE /api/templates/:id/variables/:variableName
// @access  Private
export const removeTemplateVariable = catchAsync(async (req, res, next) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    return next(new AppError('Template not found', 404));
  }

  // Check ownership
  if (template.userId.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to modify this template', 403));
  }

  const { variableName } = req.params;

  await template.removeVariable(variableName);

  res.status(200).json({
    status: 'success',
    data: {
      template
    }
  });
});
