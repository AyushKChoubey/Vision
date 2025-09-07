import mongoose from 'mongoose';
import crypto from 'crypto';

const socialAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  platform: {
    type: String,
    required: [true, 'Platform is required'],
    enum: ['instagram', 'twitter', 'facebook', 'linkedin']
  },
  platformUserId: {
    type: String,
    required: [true, 'Platform user ID is required'],
    trim: true
  },
  platformUsername: {
    type: String,
    required: [true, 'Platform username is required'],
    trim: true
  },
  accessToken: {
    type: String,
    required: [true, 'Access token is required'],
    select: false // Don't include in queries by default
  },
  refreshToken: {
    type: String,
    select: false // Don't include in queries by default
  },
  tokenExpiresAt: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  permissions: [{
    type: String,
    trim: true
  }],
  profileData: {
    name: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Avatar must be a valid URL'
      }
    },
    followers: {
      type: Number,
      min: [0, 'Followers count cannot be negative']
    },
    following: {
      type: Number,
      min: [0, 'Following count cannot be negative']
    },
    posts: {
      type: Number,
      min: [0, 'Posts count cannot be negative']
    }
  },
  lastSyncAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
socialAccountSchema.index({ userId: 1 });
socialAccountSchema.index({ platform: 1 });
socialAccountSchema.index({ userId: 1, platform: 1 }, { unique: true });
socialAccountSchema.index({ isActive: 1 });
socialAccountSchema.index({ platformUserId: 1 });

// Virtual for platform display name
socialAccountSchema.virtual('platformDisplayName').get(function() {
  const platformNames = {
    instagram: 'Instagram',
    twitter: 'X (Twitter)',
    facebook: 'Facebook',
    linkedin: 'LinkedIn'
  };
  return platformNames[this.platform] || this.platform;
});

// Virtual for platform icon
socialAccountSchema.virtual('platformIcon').get(function() {
  const platformIcons = {
    instagram: '📷',
    twitter: '🐦',
    facebook: '📘',
    linkedin: '💼'
  };
  return platformIcons[this.platform] || '🔗';
});

// Virtual for account status
socialAccountSchema.virtual('accountStatus').get(function() {
  if (!this.isActive) return 'inactive';
  if (this.tokenExpiresAt && this.tokenExpiresAt < new Date()) return 'expired';
  return 'active';
});

// Virtual for last sync time
socialAccountSchema.virtual('formattedLastSync').get(function() {
  if (!this.lastSyncAt) return 'Never';
  
  const now = new Date();
  const diff = now.getTime() - this.lastSyncAt.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Pre-save middleware to encrypt tokens
socialAccountSchema.pre('save', function(next) {
  if (this.isModified('accessToken') || this.isNew) {
    this.accessToken = this.encryptToken(this.accessToken);
  }
  
  if (this.refreshToken && (this.isModified('refreshToken') || this.isNew)) {
    this.refreshToken = this.encryptToken(this.refreshToken);
  }
  
  next();
});

// Instance method to encrypt token
socialAccountSchema.methods.encryptToken = function(token) {
  if (!token) return token;
  
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(process.env.JWT_SECRET || 'default-secret', 'salt', 32);
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipher(algorithm, key);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
};

// Instance method to decrypt token
socialAccountSchema.methods.decryptToken = function(encryptedToken) {
  if (!encryptedToken) return encryptedToken;
  
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.JWT_SECRET || 'default-secret', 'salt', 32);
    
    const parts = encryptedToken.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipher(algorithm, key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Token decryption failed:', error);
    return null;
  }
};

// Instance method to get decrypted access token
socialAccountSchema.methods.getAccessToken = function() {
  return this.decryptToken(this.accessToken);
};

// Instance method to get decrypted refresh token
socialAccountSchema.methods.getRefreshToken = function() {
  return this.decryptToken(this.refreshToken);
};

// Instance method to check if token is expired
socialAccountSchema.methods.isTokenExpired = function() {
  if (!this.tokenExpiresAt) return false;
  return this.tokenExpiresAt < new Date();
};

// Instance method to update profile data
socialAccountSchema.methods.updateProfileData = function(profileData) {
  this.profileData = { ...this.profileData, ...profileData };
  this.lastSyncAt = new Date();
  return this.save({ validateBeforeSave: false });
};

// Instance method to deactivate account
socialAccountSchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save({ validateBeforeSave: false });
};

// Instance method to reactivate account
socialAccountSchema.methods.reactivate = function() {
  this.isActive = true;
  return this.save({ validateBeforeSave: false });
};

// Instance method to check if user owns this account
socialAccountSchema.methods.isOwnedBy = function(userId) {
  return this.userId.toString() === userId.toString();
};

// Static method to find accounts by user
socialAccountSchema.statics.findByUser = function(userId, options = {}) {
  const query = { userId };
  
  if (options.platform) {
    query.platform = options.platform;
  }
  
  if (options.isActive !== undefined) {
    query.isActive = options.isActive;
  }
  
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to find active accounts
socialAccountSchema.statics.findActive = function(userId) {
  return this.find({ userId, isActive: true });
};

// Static method to find account by platform
socialAccountSchema.statics.findByPlatform = function(userId, platform) {
  return this.findOne({ userId, platform, isActive: true });
};

// Static method to get account statistics
socialAccountSchema.statics.getStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$platform',
        count: { $sum: 1 },
        activeCount: {
          $sum: { $cond: ['$isActive', 1, 0] }
        },
        totalFollowers: { $sum: '$profileData.followers' },
        totalFollowing: { $sum: '$profileData.following' }
      }
    }
  ]);
};

export const SocialAccount = mongoose.model('SocialAccount', socialAccountSchema);
