import { body, param, query, validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new AppError(`Validation failed: ${errorMessages.join(', ')}`, 400));
  }
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name must not exceed 50 characters'),
  handleValidationErrors
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

export const validateUserUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name must not exceed 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must not exceed 100 characters'),
  handleValidationErrors
];

export const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
  handleValidationErrors
];

// Creation validation rules
export const validateCreation = [
  body('type')
    .isIn(['image', 'video'])
    .withMessage('Type must be either "image" or "video"'),
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('prompt')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Prompt must be between 10 and 1000 characters'),
  body('style')
    .optional()
    .isIn(['realistic', 'artistic', 'cartoon', 'abstract', 'cinematic', 'documentary', 'commercial'])
    .withMessage('Invalid style selected'),
  body('size')
    .optional()
    .matches(/^\d+x\d+$/)
    .withMessage('Size must be in format "widthxheight" (e.g., "1024x1024")'),
  body('duration')
    .optional()
    .isInt({ min: 1, max: 60 })
    .withMessage('Duration must be between 1 and 60 seconds'),
  body('quality.creativity')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Creativity must be between 1 and 10'),
  body('quality.detailLevel')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Detail level must be between 1 and 10'),
  body('quality.motionIntensity')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Motion intensity must be between 1 and 10'),
  handleValidationErrors
];

export const validateCreationUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be between 1 and 30 characters'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean value'),
  handleValidationErrors
];

// Post validation rules
export const validatePost = [
  body('creationId')
    .isMongoId()
    .withMessage('Invalid creation ID'),
  body('platform')
    .isIn(['instagram', 'twitter', 'facebook', 'linkedin'])
    .withMessage('Platform must be one of: instagram, twitter, facebook, linkedin'),
  body('content.caption')
    .optional()
    .trim()
    .isLength({ max: 2200 })
    .withMessage('Caption must not exceed 2200 characters'),
  body('content.hashtags')
    .optional()
    .isArray()
    .withMessage('Hashtags must be an array'),
  body('content.hashtags.*')
    .optional()
    .trim()
    .matches(/^#[a-zA-Z0-9_]+$/)
    .withMessage('Each hashtag must start with # and contain only letters, numbers, and underscores'),
  body('content.mentions')
    .optional()
    .isArray()
    .withMessage('Mentions must be an array'),
  body('content.mentions.*')
    .optional()
    .trim()
    .matches(/^@[a-zA-Z0-9_]+$/)
    .withMessage('Each mention must start with @ and contain only letters, numbers, and underscores'),
  body('scheduledAt')
    .optional()
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO 8601 date'),
  handleValidationErrors
];

// Social account validation rules
export const validateSocialAccount = [
  body('platform')
    .isIn(['instagram', 'twitter', 'facebook', 'linkedin'])
    .withMessage('Platform must be one of: instagram, twitter, facebook, linkedin'),
  body('accessToken')
    .notEmpty()
    .withMessage('Access token is required'),
  handleValidationErrors
];

// Template validation rules
export const validateTemplate = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Template name must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('type')
    .isIn(['image', 'video'])
    .withMessage('Type must be either "image" or "video"'),
  body('category')
    .isIn(['marketing', 'social', 'brand', 'creative'])
    .withMessage('Category must be one of: marketing, social, brand, creative'),
  body('prompt')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Prompt must be between 10 and 1000 characters'),
  body('style')
    .optional()
    .isIn(['realistic', 'artistic', 'cartoon', 'abstract', 'cinematic', 'documentary', 'commercial'])
    .withMessage('Invalid style selected'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be between 1 and 30 characters'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean value'),
  handleValidationErrors
];

// Image generation validation rules
export const validateImageGeneration = [
  body('prompt')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Prompt must be between 5 and 500 characters'),
  body('style')
    .optional()
    .isIn(['realistic', 'artistic', 'cartoon', 'abstract'])
    .withMessage('Style must be one of: realistic, artistic, cartoon, abstract'),
  body('size')
    .optional()
    .isIn(['1024x1024', '1024x768', '768x1024', '1920x1080'])
    .withMessage('Size must be one of: 1024x1024, 1024x768, 768x1024, 1920x1080'),
  body('quality')
    .optional()
    .isIn(['standard', 'high', 'ultra'])
    .withMessage('Quality must be one of: standard, high, ultra'),
  handleValidationErrors
];

// Query parameter validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isIn(['createdAt', '-createdAt', 'title', '-title', 'updatedAt', '-updatedAt'])
    .withMessage('Invalid sort parameter'),
  handleValidationErrors
];

// MongoDB ObjectId validation
export const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName}`),
  handleValidationErrors
];
