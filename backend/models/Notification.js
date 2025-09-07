import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    required: [true, 'Notification type is required'],
    enum: ['generation_complete', 'post_scheduled', 'post_published', 'system', 'marketing', 'usage_limit', 'account_update']
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isEmailSent: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  expiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
notificationSchema.index({ userId: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for time ago
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now.getTime() - this.createdAt.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Virtual for formatted date
notificationSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Virtual for formatted time
notificationSchema.virtual('formattedTime').get(function() {
  return this.createdAt.toLocaleTimeString();
});

// Virtual for priority color
notificationSchema.virtual('priorityColor').get(function() {
  const colors = {
    low: 'gray',
    medium: 'blue',
    high: 'orange',
    urgent: 'red'
  };
  return colors[this.priority] || 'blue';
});

// Virtual for type icon
notificationSchema.virtual('typeIcon').get(function() {
  const icons = {
    generation_complete: '✨',
    post_scheduled: '📅',
    post_published: '📢',
    system: '⚙️',
    marketing: '📧',
    usage_limit: '⚠️',
    account_update: '👤'
  };
  return icons[this.type] || '📢';
});

// Virtual for type display name
notificationSchema.virtual('typeDisplayName').get(function() {
  const names = {
    generation_complete: 'Generation Complete',
    post_scheduled: 'Post Scheduled',
    post_published: 'Post Published',
    system: 'System',
    marketing: 'Marketing',
    usage_limit: 'Usage Limit',
    account_update: 'Account Update'
  };
  return names[this.type] || 'Notification';
});

// Pre-save middleware to set expiration date for certain types
notificationSchema.pre('save', function(next) {
  // Set expiration date for marketing notifications (7 days)
  if (this.type === 'marketing' && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  
  // Set expiration date for system notifications (30 days)
  if (this.type === 'system' && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  
  next();
});

// Instance method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save({ validateBeforeSave: false });
};

// Instance method to mark as unread
notificationSchema.methods.markAsUnread = function() {
  this.isRead = false;
  return this.save({ validateBeforeSave: false });
};

// Instance method to mark email as sent
notificationSchema.methods.markEmailSent = function() {
  this.isEmailSent = true;
  return this.save({ validateBeforeSave: false });
};

// Instance method to check if expired
notificationSchema.methods.isExpired = function() {
  return this.expiresAt && this.expiresAt < new Date();
};

// Instance method to check if user owns this notification
notificationSchema.methods.isOwnedBy = function(userId) {
  return this.userId.toString() === userId.toString();
};

// Static method to create notification
notificationSchema.statics.createNotification = function(userId, type, title, message, data = {}, options = {}) {
  return this.create({
    userId,
    type,
    title,
    message,
    data,
    priority: options.priority || 'medium',
    expiresAt: options.expiresAt || null
  });
};

// Static method to find notifications by user
notificationSchema.statics.findByUser = function(userId, options = {}) {
  const query = { userId };
  
  if (options.type) {
    query.type = options.type;
  }
  
  if (options.isRead !== undefined) {
    query.isRead = options.isRead;
  }
  
  if (options.priority) {
    query.priority = options.priority;
  }
  
  // Exclude expired notifications
  query.$or = [
    { expiresAt: null },
    { expiresAt: { $gt: new Date() } }
  ];
  
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to find unread notifications
notificationSchema.statics.findUnread = function(userId) {
  return this.find({
    userId,
    isRead: false,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  }).sort({ createdAt: -1 });
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );
};

// Static method to get notification count
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    userId,
    isRead: false,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  });
};

// Static method to get notification statistics
notificationSchema.statics.getStats = function(userId, startDate, endDate) {
  const matchStage = { userId };
  
  if (startDate && endDate) {
    matchStage.createdAt = { $gte: startDate, $lte: endDate };
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        readCount: { $sum: { $cond: ['$isRead', 1, 0] } },
        unreadCount: { $sum: { $cond: ['$isRead', 0, 1] } }
      }
    }
  ]);
};

// Static method to cleanup expired notifications
notificationSchema.statics.cleanupExpired = function() {
  return this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
};

export const Notification = mongoose.model('Notification', notificationSchema);
