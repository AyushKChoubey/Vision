import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Template name is required'],
    trim: true,
    maxlength: [100, 'Template name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    required: [true, 'Template type is required'],
    enum: ['image', 'video']
  },
  category: {
    type: String,
    required: [true, 'Template category is required'],
    enum: ['marketing', 'social', 'brand', 'creative']
  },
  prompt: {
    type: String,
    required: [true, 'Template prompt is required'],
    trim: true,
    maxlength: [1000, 'Prompt cannot exceed 1000 characters']
  },
  style: {
    type: String,
    enum: ['realistic', 'artistic', 'cartoon', 'abstract', 'cinematic', 'documentary', 'commercial'],
    default: 'realistic'
  },
  settings: {
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
    }
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  usageCount: {
    type: Number,
    default: 0,
    min: [0, 'Usage count cannot be negative']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Each tag cannot exceed 30 characters']
  }],
  metadata: {
    originalPrompt: {
      type: String,
      trim: true
    },
    variables: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      type: {
        type: String,
        enum: ['text', 'number', 'select', 'boolean'],
        default: 'text'
      },
      defaultValue: String,
      options: [String], // For select type
      required: {
        type: Boolean,
        default: false
      },
      description: String
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
templateSchema.index({ userId: 1 });
templateSchema.index({ type: 1 });
templateSchema.index({ category: 1 });
templateSchema.index({ isPublic: 1 });
templateSchema.index({ usageCount: -1 });
templateSchema.index({ tags: 1 });
templateSchema.index({ userId: 1, type: 1 });
templateSchema.index({ isPublic: 1, category: 1, type: 1 });

// Virtual for template display name
templateSchema.virtual('displayName').get(function() {
  return this.name || 'Untitled Template';
});

// Virtual for category display name
templateSchema.virtual('categoryDisplayName').get(function() {
  const categoryNames = {
    marketing: 'Marketing',
    social: 'Social Media',
    brand: 'Brand',
    creative: 'Creative'
  };
  return categoryNames[this.category] || this.category;
});

// Virtual for type display name
templateSchema.virtual('typeDisplayName').get(function() {
  return this.type === 'image' ? 'Image' : 'Video';
});

// Virtual for usage frequency
templateSchema.virtual('usageFrequency').get(function() {
  const daysSinceCreation = Math.ceil((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
  if (daysSinceCreation === 0) return 0;
  return (this.usageCount / daysSinceCreation).toFixed(2);
});

// Virtual for formatted usage count
templateSchema.virtual('formattedUsageCount').get(function() {
  if (this.usageCount === 0) return 'Never used';
  if (this.usageCount === 1) return 'Used once';
  return `Used ${this.usageCount} times`;
});

// Pre-save middleware to set default settings based on type
templateSchema.pre('save', function(next) {
  if (this.type === 'video' && !this.settings.duration) {
    this.settings.duration = 5; // Default duration for videos
  }
  
  if (this.type === 'image' && !this.settings.size) {
    this.settings.size = '1024x1024'; // Default size for images
  }
  
  next();
});

// Instance method to increment usage count
templateSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save({ validateBeforeSave: false });
};

// Instance method to check if user owns this template
templateSchema.methods.isOwnedBy = function(userId) {
  return this.userId.toString() === userId.toString();
};

// Instance method to make public
templateSchema.methods.makePublic = function() {
  this.isPublic = true;
  return this.save({ validateBeforeSave: false });
};

// Instance method to make private
templateSchema.methods.makePrivate = function() {
  this.isPublic = false;
  return this.save({ validateBeforeSave: false });
};

// Instance method to add variable
templateSchema.methods.addVariable = function(variable) {
  if (!this.metadata.variables) {
    this.metadata.variables = [];
  }
  this.metadata.variables.push(variable);
  return this.save({ validateBeforeSave: false });
};

// Instance method to remove variable
templateSchema.methods.removeVariable = function(variableName) {
  if (this.metadata.variables) {
    this.metadata.variables = this.metadata.variables.filter(
      v => v.name !== variableName
    );
  }
  return this.save({ validateBeforeSave: false });
};

// Instance method to process prompt with variables
templateSchema.methods.processPrompt = function(variables = {}) {
  let processedPrompt = this.prompt;
  
  if (this.metadata.variables) {
    this.metadata.variables.forEach(variable => {
      const value = variables[variable.name] || variable.defaultValue || '';
      const placeholder = `{{${variable.name}}}`;
      processedPrompt = processedPrompt.replace(new RegExp(placeholder, 'g'), value);
    });
  }
  
  return processedPrompt;
};

// Static method to find templates by user
templateSchema.statics.findByUser = function(userId, options = {}) {
  const query = { userId };
  
  if (options.type) {
    query.type = options.type;
  }
  
  if (options.category) {
    query.category = options.category;
  }
  
  if (options.isPublic !== undefined) {
    query.isPublic = options.isPublic;
  }
  
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to find public templates
templateSchema.statics.findPublic = function(options = {}) {
  const query = { isPublic: true };
  
  if (options.type) {
    query.type = options.type;
  }
  
  if (options.category) {
    query.category = options.category;
  }
  
  if (options.tags && options.tags.length > 0) {
    query.tags = { $in: options.tags };
  }
  
  return this.find(query).sort({ usageCount: -1, createdAt: -1 });
};

// Static method to find popular templates
templateSchema.statics.findPopular = function(limit = 10) {
  return this.find({ isPublic: true })
    .sort({ usageCount: -1 })
    .limit(limit);
};

// Static method to find templates by category
templateSchema.statics.findByCategory = function(category, options = {}) {
  const query = { category };
  
  if (options.isPublic !== undefined) {
    query.isPublic = options.isPublic;
  }
  
  if (options.type) {
    query.type = options.type;
  }
  
  return this.find(query).sort({ usageCount: -1, createdAt: -1 });
};

// Static method to search templates
templateSchema.statics.search = function(searchTerm, options = {}) {
  const query = {
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { prompt: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ]
  };
  
  if (options.isPublic !== undefined) {
    query.isPublic = options.isPublic;
  }
  
  if (options.type) {
    query.type = options.type;
  }
  
  if (options.category) {
    query.category = options.category;
  }
  
  return this.find(query).sort({ usageCount: -1, createdAt: -1 });
};

// Static method to get template statistics
templateSchema.statics.getStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalUsage: { $sum: '$usageCount' },
        avgUsage: { $avg: '$usageCount' }
      }
    }
  ]);
};

export const Template = mongoose.model('Template', templateSchema);
