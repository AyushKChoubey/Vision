import mongoose from 'mongoose';

const usageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  period: {
    type: String,
    required: [true, 'Period is required'],
    enum: ['daily', 'monthly']
  },
  periodStart: {
    type: Date,
    required: [true, 'Period start date is required']
  },
  periodEnd: {
    type: Date,
    required: [true, 'Period end date is required']
  },
  limits: {
    images: {
      type: Number,
      default: 1000, // Increased for testing
      min: [0, 'Image limit cannot be negative']
    },
    videos: {
      type: Number,
      default: 100, // Increased for testing
      min: [0, 'Video limit cannot be negative']
    },
    posts: {
      type: Number,
      default: 500, // Increased for testing
      min: [0, 'Post limit cannot be negative']
    }
  },
  usage: {
    images: {
      type: Number,
      default: 0,
      min: [0, 'Image usage cannot be negative']
    },
    videos: {
      type: Number,
      default: 0,
      min: [0, 'Video usage cannot be negative']
    },
    posts: {
      type: Number,
      default: 0,
      min: [0, 'Post usage cannot be negative']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
usageSchema.index({ userId: 1 });
usageSchema.index({ period: 1 });
usageSchema.index({ periodStart: 1 });
usageSchema.index({ periodEnd: 1 });
usageSchema.index({ userId: 1, period: 1, periodStart: 1 }, { unique: true });

// Virtual for total usage
usageSchema.virtual('totalUsage').get(function() {
  return this.usage.images + this.usage.videos + this.usage.posts;
});

// Virtual for total limits
usageSchema.virtual('totalLimits').get(function() {
  return this.limits.images + this.limits.videos + this.limits.posts;
});

// Virtual for usage percentage
usageSchema.virtual('usagePercentage').get(function() {
  if (this.totalLimits === 0) return 0;
  return Math.round((this.totalUsage / this.totalLimits) * 100);
});

// Virtual for remaining usage
usageSchema.virtual('remainingUsage').get(function() {
  return {
    images: Math.max(0, this.limits.images - this.usage.images),
    videos: Math.max(0, this.limits.videos - this.usage.videos),
    posts: Math.max(0, this.limits.posts - this.usage.posts)
  };
});

// Virtual for formatted period
usageSchema.virtual('formattedPeriod').get(function() {
  const start = this.periodStart.toLocaleDateString();
  const end = this.periodEnd.toLocaleDateString();
  return `${start} - ${end}`;
});

// Virtual for period status
usageSchema.virtual('periodStatus').get(function() {
  const now = new Date();
  if (now < this.periodStart) return 'upcoming';
  if (now > this.periodEnd) return 'expired';
  return 'active';
});

// Pre-save middleware to validate period dates
usageSchema.pre('save', function(next) {
  if (this.periodStart >= this.periodEnd) {
    return next(new Error('Period start date must be before period end date'));
  }
  
  // Validate period length based on period type
  const diffInDays = Math.ceil((this.periodEnd - this.periodStart) / (1000 * 60 * 60 * 24));
  
  if (this.period === 'daily' && diffInDays !== 1) {
    return next(new Error('Daily period must be exactly 1 day'));
  }
  
  if (this.period === 'monthly' && (diffInDays < 28 || diffInDays > 31)) {
    return next(new Error('Monthly period must be between 28 and 31 days'));
  }
  
  next();
});

// Instance method to increment usage
usageSchema.methods.incrementUsage = function(type, amount = 1) {
  if (this.usage[type] !== undefined) {
    this.usage[type] += amount;
  }
  return this.save({ validateBeforeSave: false });
};

// Instance method to decrement usage
usageSchema.methods.decrementUsage = function(type, amount = 1) {
  if (this.usage[type] !== undefined) {
    this.usage[type] = Math.max(0, this.usage[type] - amount);
  }
  return this.save({ validateBeforeSave: false });
};

// Instance method to check if usage limit is exceeded
usageSchema.methods.isLimitExceeded = function(type) {
  if (this.usage[type] === undefined || this.limits[type] === undefined) {
    return false;
  }
  return this.usage[type] >= this.limits[type];
};

// Instance method to check if any limit is exceeded
usageSchema.methods.isAnyLimitExceeded = function() {
  return this.isLimitExceeded('images') || 
         this.isLimitExceeded('videos') || 
         this.isLimitExceeded('posts');
};

// Instance method to get usage status
usageSchema.methods.getUsageStatus = function(type) {
  if (this.usage[type] === undefined || this.limits[type] === undefined) {
    return 'unknown';
  }
  
  const percentage = (this.usage[type] / this.limits[type]) * 100;
  
  if (percentage >= 100) return 'exceeded';
  if (percentage >= 90) return 'critical';
  if (percentage >= 75) return 'warning';
  return 'normal';
};

// Instance method to reset usage
usageSchema.methods.resetUsage = function() {
  this.usage = {
    images: 0,
    videos: 0,
    posts: 0
  };
  return this.save({ validateBeforeSave: false });
};

// Instance method to update limits
usageSchema.methods.updateLimits = function(newLimits) {
  Object.keys(newLimits).forEach(key => {
    if (this.limits[key] !== undefined) {
      this.limits[key] = newLimits[key];
    }
  });
  return this.save({ validateBeforeSave: false });
};

// Static method to find usage by user
usageSchema.statics.findByUser = function(userId, options = {}) {
  const query = { userId };
  
  if (options.period) {
    query.period = options.period;
  }
  
  if (options.startDate && options.endDate) {
    query.periodStart = { $gte: options.startDate };
    query.periodEnd = { $lte: options.endDate };
  }
  
  return this.find(query).sort({ periodStart: -1 });
};

// Static method to find current usage
usageSchema.statics.findCurrent = function(userId, period = 'monthly') {
  const now = new Date();
  return this.findOne({
    userId,
    period,
    periodStart: { $lte: now },
    periodEnd: { $gte: now }
  });
};

// Static method to create or update usage
usageSchema.statics.createOrUpdate = async function(userId, period, periodStart, periodEnd, limits) {
  const existing = await this.findOne({
    userId,
    period,
    periodStart,
    periodEnd
  });
  
  if (existing) {
    existing.limits = { ...existing.limits, ...limits };
    return existing.save();
  }
  
  return this.create({
    userId,
    period,
    periodStart,
    periodEnd,
    limits
  });
};

// Static method to get usage statistics
usageSchema.statics.getStats = function(userId, startDate, endDate) {
  const matchStage = { userId };
  
  if (startDate && endDate) {
    matchStage.periodStart = { $gte: startDate };
    matchStage.periodEnd = { $lte: endDate };
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$period',
        totalImages: { $sum: '$usage.images' },
        totalVideos: { $sum: '$usage.videos' },
        totalPosts: { $sum: '$usage.posts' },
        avgImages: { $avg: '$usage.images' },
        avgVideos: { $avg: '$usage.videos' },
        avgPosts: { $avg: '$usage.posts' },
        maxImages: { $max: '$usage.images' },
        maxVideos: { $max: '$usage.videos' },
        maxPosts: { $max: '$usage.posts' }
      }
    }
  ]);
};

export const Usage = mongoose.model('Usage', usageSchema);
