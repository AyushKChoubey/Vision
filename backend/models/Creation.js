import mongoose from 'mongoose';

const creationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    required: [true, 'Creation type is required'],
    enum: ['image', 'video']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  prompt: {
    type: String,
    required: [true, 'Prompt is required'],
    trim: true,
    maxlength: [1000, 'Prompt cannot exceed 1000 characters']
  },
  style: {
    type: String,
    enum: ['realistic', 'artistic', 'cartoon', 'abstract', 'cinematic', 'documentary', 'commercial'],
    default: 'realistic'
  },
  size: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^\d+x\d+$/.test(v);
      },
      message: 'Size must be in format "widthxheight" (e.g., "1024x1024")'
    }
  },
  duration: {
    type: Number,
    min: [1, 'Duration must be at least 1 second'],
    max: [60, 'Duration cannot exceed 60 seconds']
  },
  quality: {
    creativity: {
      type: Number,
      min: [1, 'Creativity must be at least 1'],
      max: [10, 'Creativity cannot exceed 10'],
      default: 7
    },
    detailLevel: {
      type: Number,
      min: [1, 'Detail level must be at least 1'],
      max: [10, 'Detail level cannot exceed 10'],
      default: 8
    },
    motionIntensity: {
      type: Number,
      min: [1, 'Motion intensity must be at least 1'],
      max: [10, 'Motion intensity cannot exceed 10'],
      default: 6
    }
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed', 'deleted'],
    default: 'generating'
  },
  fileUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'File URL must be a valid URL'
    }
  },
  thumbnailUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Thumbnail URL must be a valid URL'
    }
  },
  fileSize: {
    type: Number,
    min: [0, 'File size cannot be negative']
  },
  generationTime: {
    type: Number,
    min: [0, 'Generation time cannot be negative']
  },
  model: {
    type: String,
    trim: true
  },
  metadata: {
    width: {
      type: Number,
      min: [1, 'Width must be positive']
    },
    height: {
      type: Number,
      min: [1, 'Height must be positive']
    },
    format: {
      type: String,
      enum: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi', 'webm']
    },
    colorSpace: {
      type: String,
      enum: ['RGB', 'RGBA', 'CMYK', 'Grayscale']
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Each tag cannot exceed 30 characters']
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  downloadCount: {
    type: Number,
    default: 0,
    min: [0, 'Download count cannot be negative']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
creationSchema.index({ userId: 1 });
creationSchema.index({ type: 1 });
creationSchema.index({ status: 1 });
creationSchema.index({ createdAt: -1 });
creationSchema.index({ userId: 1, type: 1 });
creationSchema.index({ userId: 1, createdAt: -1 });
creationSchema.index({ isPublic: 1, createdAt: -1 });
creationSchema.index({ tags: 1 });

// Virtual for file type
creationSchema.virtual('fileType').get(function() {
  if (this.type === 'image') {
    return 'image';
  } else if (this.type === 'video') {
    return 'video';
  }
  return 'unknown';
});

// Virtual for formatted file size
creationSchema.virtual('formattedFileSize').get(function() {
  if (!this.fileSize) return null;
  
  const bytes = this.fileSize;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual for formatted generation time
creationSchema.virtual('formattedGenerationTime').get(function() {
  if (!this.generationTime) return null;
  
  if (this.generationTime < 60) {
    return `${this.generationTime.toFixed(1)}s`;
  } else {
    const minutes = Math.floor(this.generationTime / 60);
    const seconds = (this.generationTime % 60).toFixed(1);
    return `${minutes}m ${seconds}s`;
  }
});

// Pre-save middleware to set duration for videos
creationSchema.pre('save', function(next) {
  if (this.type === 'video' && !this.duration) {
    this.duration = 5; // Default duration for videos
  }
  next();
});

// Pre-save middleware to set size for images
creationSchema.pre('save', function(next) {
  if (this.type === 'image' && !this.size) {
    this.size = '1024x1024'; // Default size for images
  }
  next();
});

// Instance method to increment download count
creationSchema.methods.incrementDownloadCount = function() {
  this.downloadCount += 1;
  return this.save({ validateBeforeSave: false });
};

// Instance method to check if user owns this creation
creationSchema.methods.isOwnedBy = function(userId) {
  return this.userId.toString() === userId.toString();
};

// Static method to find creations by user
creationSchema.statics.findByUser = function(userId, options = {}) {
  const query = { userId };
  
  if (options.type) {
    query.type = options.type;
  }
  
  if (options.status) {
    query.status = options.status;
  }
  
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to find public creations
creationSchema.statics.findPublic = function(options = {}) {
  const query = { isPublic: true, status: 'completed' };
  
  if (options.type) {
    query.type = options.type;
  }
  
  if (options.tags && options.tags.length > 0) {
    query.tags = { $in: options.tags };
  }
  
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to get creation statistics
creationSchema.statics.getStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalSize: { $sum: '$fileSize' },
        avgGenerationTime: { $avg: '$generationTime' }
      }
    }
  ]);
};

export const Creation = mongoose.model('Creation', creationSchema);
