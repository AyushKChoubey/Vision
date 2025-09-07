import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Some analytics might be global
  },
  type: {
    type: String,
    required: [true, 'Analytics type is required'],
    enum: ['creation', 'post', 'user_activity', 'platform_usage', 'system']
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false // Not all analytics have a specific entity
  },
  entityType: {
    type: String,
    enum: ['Creation', 'Post', 'User', 'SocialAccount'],
    required: false
  },
  metrics: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Metrics are required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  period: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
    default: 'daily'
  },
  metadata: {
    source: {
      type: String,
      enum: ['api', 'webhook', 'cron', 'manual'],
      default: 'api'
    },
    version: {
      type: String,
      default: '1.0'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
analyticsSchema.index({ userId: 1 });
analyticsSchema.index({ type: 1 });
analyticsSchema.index({ date: -1 });
analyticsSchema.index({ entityId: 1 });
analyticsSchema.index({ period: 1 });
analyticsSchema.index({ userId: 1, type: 1, date: -1 });
analyticsSchema.index({ type: 1, date: -1 });
analyticsSchema.index({ entityId: 1, type: 1, date: -1 });

// Virtual for formatted date
analyticsSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString();
});

// Virtual for time ago
analyticsSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now.getTime() - this.date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Pre-save middleware to validate metrics based on type
analyticsSchema.pre('save', function(next) {
  // Validate metrics structure based on type
  switch (this.type) {
    case 'creation':
      this.validateCreationMetrics();
      break;
    case 'post':
      this.validatePostMetrics();
      break;
    case 'user_activity':
      this.validateUserActivityMetrics();
      break;
    case 'platform_usage':
      this.validatePlatformUsageMetrics();
      break;
    case 'system':
      this.validateSystemMetrics();
      break;
  }
  next();
});

// Validation methods for different metric types
analyticsSchema.methods.validateCreationMetrics = function() {
  const requiredFields = ['generationTime', 'fileSize', 'status'];
  const optionalFields = ['model', 'style', 'quality'];
  
  requiredFields.forEach(field => {
    if (this.metrics[field] === undefined) {
      throw new Error(`Missing required field for creation analytics: ${field}`);
    }
  });
};

analyticsSchema.methods.validatePostMetrics = function() {
  const requiredFields = ['platform', 'status'];
  const optionalFields = ['engagement', 'reach', 'impressions'];
  
  requiredFields.forEach(field => {
    if (this.metrics[field] === undefined) {
      throw new Error(`Missing required field for post analytics: ${field}`);
    }
  });
};

analyticsSchema.methods.validateUserActivityMetrics = function() {
  const requiredFields = ['action', 'timestamp'];
  const optionalFields = ['duration', 'success'];
  
  requiredFields.forEach(field => {
    if (this.metrics[field] === undefined) {
      throw new Error(`Missing required field for user activity analytics: ${field}`);
    }
  });
};

analyticsSchema.methods.validatePlatformUsageMetrics = function() {
  const requiredFields = ['platform', 'action'];
  const optionalFields = ['duration', 'success', 'error'];
  
  requiredFields.forEach(field => {
    if (this.metrics[field] === undefined) {
      throw new Error(`Missing required field for platform usage analytics: ${field}`);
    }
  });
};

analyticsSchema.methods.validateSystemMetrics = function() {
  const requiredFields = ['metric', 'value'];
  const optionalFields = ['unit', 'threshold'];
  
  requiredFields.forEach(field => {
    if (this.metrics[field] === undefined) {
      throw new Error(`Missing required field for system analytics: ${field}`);
    }
  });
};

// Instance method to update metrics
analyticsSchema.methods.updateMetrics = function(newMetrics) {
  this.metrics = { ...this.metrics, ...newMetrics };
  return this.save({ validateBeforeSave: false });
};

// Static method to find analytics by user
analyticsSchema.statics.findByUser = function(userId, options = {}) {
  const query = { userId };
  
  if (options.type) {
    query.type = options.type;
  }
  
  if (options.startDate && options.endDate) {
    query.date = { $gte: options.startDate, $lte: options.endDate };
  }
  
  return this.find(query).sort({ date: -1 });
};

// Static method to find analytics by entity
analyticsSchema.statics.findByEntity = function(entityId, entityType, options = {}) {
  const query = { entityId, entityType };
  
  if (options.type) {
    query.type = options.type;
  }
  
  if (options.startDate && options.endDate) {
    query.date = { $gte: options.startDate, $lte: options.endDate };
  }
  
  return this.find(query).sort({ date: -1 });
};

// Static method to get aggregated analytics
analyticsSchema.statics.getAggregated = function(userId, type, period, startDate, endDate) {
  const matchStage = { userId, type };
  
  if (startDate && endDate) {
    matchStage.date = { $gte: startDate, $lte: endDate };
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          $dateToString: {
            format: period === 'daily' ? '%Y-%m-%d' : 
                   period === 'weekly' ? '%Y-%U' :
                   period === 'monthly' ? '%Y-%m' : '%Y',
            date: '$date'
          }
        },
        count: { $sum: 1 },
        metrics: { $push: '$metrics' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Static method to get analytics summary
analyticsSchema.statics.getSummary = function(userId, startDate, endDate) {
  const matchStage = { userId };
  
  if (startDate && endDate) {
    matchStage.date = { $gte: startDate, $lte: endDate };
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        latestDate: { $max: '$date' },
        earliestDate: { $min: '$date' }
      }
    }
  ]);
};

// Static method to get top metrics
analyticsSchema.statics.getTopMetrics = function(userId, type, metricField, limit = 10) {
  return this.aggregate([
    { $match: { userId, type } },
    { $unwind: `$metrics.${metricField}` },
    {
      $group: {
        _id: `$metrics.${metricField}`,
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
};

export const Analytics = mongoose.model('Analytics', analyticsSchema);
