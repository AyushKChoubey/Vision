import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  creationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Creation',
    required: [true, 'Creation ID is required']
  },
  platform: {
    type: String,
    required: [true, 'Platform is required'],
    enum: ['instagram', 'twitter', 'facebook', 'linkedin']
  },
  content: {
    caption: {
      type: String,
      trim: true,
      maxlength: [2200, 'Caption cannot exceed 2200 characters']
    },
    hashtags: [{
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return /^#[a-zA-Z0-9_]+$/.test(v);
        },
        message: 'Hashtags must start with # and contain only letters, numbers, and underscores'
      }
    }],
    mentions: [{
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return /^@[a-zA-Z0-9_]+$/.test(v);
        },
        message: 'Mentions must start with @ and contain only letters, numbers, and underscores'
      }
    }],
    link: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Link must be a valid URL'
      }
    }
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'posted', 'failed'],
    default: 'draft'
  },
  scheduledAt: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v > new Date();
      },
      message: 'Scheduled date must be in the future'
    }
  },
  postedAt: Date,
  platformPostId: {
    type: String,
    trim: true
  },
  engagement: {
    likes: {
      type: Number,
      default: 0,
      min: [0, 'Likes cannot be negative']
    },
    comments: {
      type: Number,
      default: 0,
      min: [0, 'Comments cannot be negative']
    },
    shares: {
      type: Number,
      default: 0,
      min: [0, 'Shares cannot be negative']
    },
    views: {
      type: Number,
      default: 0,
      min: [0, 'Views cannot be negative']
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  analytics: {
    reach: {
      type: Number,
      min: [0, 'Reach cannot be negative']
    },
    impressions: {
      type: Number,
      min: [0, 'Impressions cannot be negative']
    },
    clicks: {
      type: Number,
      min: [0, 'Clicks cannot be negative']
    },
    saves: {
      type: Number,
      min: [0, 'Saves cannot be negative']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
postSchema.index({ userId: 1 });
postSchema.index({ creationId: 1 });
postSchema.index({ platform: 1 });
postSchema.index({ status: 1 });
postSchema.index({ scheduledAt: 1 });
postSchema.index({ postedAt: -1 });
postSchema.index({ userId: 1, platform: 1 });
postSchema.index({ status: 1, scheduledAt: 1 });
postSchema.index({ platformPostId: 1 }, { sparse: true });

// Virtual for total engagement
postSchema.virtual('totalEngagement').get(function() {
  return this.engagement.likes + this.engagement.comments + this.engagement.shares;
});

// Virtual for engagement rate
postSchema.virtual('engagementRate').get(function() {
  if (!this.engagement.views || this.engagement.views === 0) return 0;
  return ((this.totalEngagement / this.engagement.views) * 100).toFixed(2);
});

// Virtual for formatted scheduled date
postSchema.virtual('formattedScheduledAt').get(function() {
  if (!this.scheduledAt) return null;
  return this.scheduledAt.toLocaleString();
});

// Virtual for formatted posted date
postSchema.virtual('formattedPostedAt').get(function() {
  if (!this.postedAt) return null;
  return this.postedAt.toLocaleString();
});

// Virtual for time until scheduled
postSchema.virtual('timeUntilScheduled').get(function() {
  if (!this.scheduledAt || this.status !== 'scheduled') return null;
  
  const now = new Date();
  const diff = this.scheduledAt.getTime() - now.getTime();
  
  if (diff <= 0) return 'Overdue';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
});

// Pre-save middleware to validate scheduled date
postSchema.pre('save', function(next) {
  if (this.status === 'scheduled' && this.scheduledAt && this.scheduledAt <= new Date()) {
    return next(new Error('Scheduled date must be in the future'));
  }
  next();
});

// Pre-save middleware to set posted date
postSchema.pre('save', function(next) {
  if (this.status === 'posted' && !this.postedAt) {
    this.postedAt = new Date();
  }
  next();
});

// Instance method to update engagement
postSchema.methods.updateEngagement = function(engagementData) {
  Object.keys(engagementData).forEach(key => {
    if (this.engagement[key] !== undefined) {
      this.engagement[key] = engagementData[key];
    }
  });
  this.engagement.lastUpdated = new Date();
  return this.save({ validateBeforeSave: false });
};

// Instance method to update analytics
postSchema.methods.updateAnalytics = function(analyticsData) {
  Object.keys(analyticsData).forEach(key => {
    if (this.analytics[key] !== undefined) {
      this.analytics[key] = analyticsData[key];
    }
  });
  return this.save({ validateBeforeSave: false });
};

// Instance method to check if user owns this post
postSchema.methods.isOwnedBy = function(userId) {
  return this.userId.toString() === userId.toString();
};

// Static method to find posts by user
postSchema.statics.findByUser = function(userId, options = {}) {
  const query = { userId };
  
  if (options.platform) {
    query.platform = options.platform;
  }
  
  if (options.status) {
    query.status = options.status;
  }
  
  return this.find(query).populate('creationId').sort({ createdAt: -1 });
};

// Static method to find scheduled posts
postSchema.statics.findScheduled = function() {
  return this.find({
    status: 'scheduled',
    scheduledAt: { $lte: new Date() }
  }).populate('userId creationId');
};

// Static method to find posts by creation
postSchema.statics.findByCreation = function(creationId) {
  return this.find({ creationId }).sort({ createdAt: -1 });
};

// Static method to get post statistics
postSchema.statics.getStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$platform',
        count: { $sum: 1 },
        totalLikes: { $sum: '$engagement.likes' },
        totalComments: { $sum: '$engagement.comments' },
        totalShares: { $sum: '$engagement.shares' },
        totalViews: { $sum: '$engagement.views' }
      }
    }
  ]);
};

export const Post = mongoose.model('Post', postSchema);
