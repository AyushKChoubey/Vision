# Vision-Cast Database Schema Design

## Overview
This document outlines the MongoDB database schema for the Vision-Cast platform, designed with BCNF (Boyce-Codd Normal Form) normalization principles.

## Database Collections

### 1. Users Collection
**Purpose**: Store user account information and authentication data

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String,
  fullName: String (computed),
  avatar: String (URL),
  bio: String,
  website: String,
  location: String,
  isEmailVerified: Boolean (default: false),
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  loginCount: Number (default: 0),
  isActive: Boolean (default: true),
  role: String (enum: ['user', 'admin'], default: 'user'),
  subscription: {
    plan: String (enum: ['free', 'pro', 'enterprise'], default: 'free'),
    startDate: Date,
    endDate: Date,
    isActive: Boolean
  },
  preferences: {
    theme: String (default: 'dark'),
    notifications: {
      email: Boolean (default: true),
      push: Boolean (default: true),
      marketing: Boolean (default: false)
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Creations Collection
**Purpose**: Store AI-generated content (images and videos)

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  type: String (enum: ['image', 'video'], required),
  title: String (required),
  description: String,
  prompt: String (required),
  style: String (enum: ['realistic', 'artistic', 'cartoon', 'abstract', 'cinematic', 'documentary', 'commercial']),
  size: String (for images: '1024x1024', '1024x768', etc.),
  duration: Number (for videos, in seconds),
  quality: {
    creativity: Number (1-10),
    detailLevel: Number (1-10),
    motionIntensity: Number (1-10, for videos)
  },
  status: String (enum: ['generating', 'completed', 'failed', 'deleted'], default: 'generating'),
  fileUrl: String (URL to generated content),
  thumbnailUrl: String (URL to thumbnail),
  fileSize: Number (in bytes),
  generationTime: Number (in seconds),
  model: String (AI model used),
  metadata: {
    width: Number,
    height: Number,
    format: String,
    colorSpace: String
  },
  tags: [String],
  isPublic: Boolean (default: false),
  downloadCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Posts Collection
**Purpose**: Store social media posts and scheduling information

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  creationId: ObjectId (ref: 'Creation', required),
  platform: String (enum: ['instagram', 'twitter', 'facebook', 'linkedin'], required),
  content: {
    caption: String,
    hashtags: [String],
    mentions: [String],
    link: String
  },
  status: String (enum: ['draft', 'scheduled', 'posted', 'failed'], default: 'draft'),
  scheduledAt: Date,
  postedAt: Date,
  platformPostId: String (ID from social media platform),
  engagement: {
    likes: Number (default: 0),
    comments: Number (default: 0),
    shares: Number (default: 0),
    views: Number (default: 0),
    lastUpdated: Date
  },
  analytics: {
    reach: Number,
    impressions: Number,
    clicks: Number,
    saves: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 4. SocialAccounts Collection
**Purpose**: Store user's connected social media accounts

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  platform: String (enum: ['instagram', 'twitter', 'facebook', 'linkedin'], required),
  platformUserId: String (required),
  platformUsername: String (required),
  accessToken: String (encrypted, required),
  refreshToken: String (encrypted),
  tokenExpiresAt: Date,
  isActive: Boolean (default: true),
  permissions: [String], // granted permissions from platform
  profileData: {
    name: String,
    avatar: String,
    followers: Number,
    following: Number,
    posts: Number
  },
  lastSyncAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Analytics Collection
**Purpose**: Store analytics and usage statistics

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  type: String (enum: ['creation', 'post', 'user_activity', 'platform_usage']),
  entityId: ObjectId, // ID of related entity (creation, post, etc.)
  metrics: {
    // Flexible object to store various metrics
    [key: String]: Number | String | Date
  },
  date: Date (required),
  period: String (enum: ['daily', 'weekly', 'monthly', 'yearly']),
  createdAt: Date
}
```

### 6. Usage Collection
**Purpose**: Track API usage and limits

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  period: String (enum: ['daily', 'monthly'], required),
  periodStart: Date (required),
  periodEnd: Date (required),
  limits: {
    images: Number (default: 10 for free plan),
    videos: Number (default: 3 for free plan),
    posts: Number (default: 20 for free plan)
  },
  usage: {
    images: Number (default: 0),
    videos: Number (default: 0),
    posts: Number (default: 0)
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 7. Notifications Collection
**Purpose**: Store user notifications

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  type: String (enum: ['generation_complete', 'post_scheduled', 'post_published', 'system', 'marketing']),
  title: String (required),
  message: String (required),
  data: Object, // Additional data related to notification
  isRead: Boolean (default: false),
  isEmailSent: Boolean (default: false),
  createdAt: Date
}
```

### 8. Templates Collection
**Purpose**: Store reusable content templates

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  name: String (required),
  description: String,
  type: String (enum: ['image', 'video'], required),
  category: String (enum: ['marketing', 'social', 'brand', 'creative']),
  prompt: String (required),
  style: String,
  settings: Object, // Generation settings
  isPublic: Boolean (default: false),
  usageCount: Number (default: 0),
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes

### Users Collection
- `email` (unique)
- `isActive`
- `createdAt`

### Creations Collection
- `userId`
- `type`
- `status`
- `createdAt`
- `userId + type` (compound)
- `userId + createdAt` (compound)

### Posts Collection
- `userId`
- `creationId`
- `platform`
- `status`
- `scheduledAt`
- `userId + platform` (compound)
- `status + scheduledAt` (compound)

### SocialAccounts Collection
- `userId`
- `platform`
- `userId + platform` (unique compound)
- `isActive`

### Analytics Collection
- `userId`
- `type`
- `date`
- `userId + type + date` (compound)

### Usage Collection
- `userId`
- `period`
- `periodStart`
- `userId + period + periodStart` (unique compound)

### Notifications Collection
- `userId`
- `isRead`
- `createdAt`
- `userId + isRead` (compound)

### Templates Collection
- `userId`
- `type`
- `category`
- `isPublic`
- `userId + type` (compound)

## Relationships

1. **User → Creations**: One-to-Many
2. **User → Posts**: One-to-Many
3. **User → SocialAccounts**: One-to-Many
4. **User → Analytics**: One-to-Many
5. **User → Usage**: One-to-Many
6. **User → Notifications**: One-to-Many
7. **User → Templates**: One-to-Many
8. **Creation → Posts**: One-to-Many
9. **Post → Analytics**: One-to-Many

## BCNF Compliance

The schema follows BCNF normalization by:

1. **Eliminating redundancy**: Each piece of data is stored in one place
2. **Proper key relationships**: All non-key attributes are fully functionally dependent on the primary key
3. **No transitive dependencies**: All attributes depend directly on the primary key
4. **Atomic values**: All fields contain atomic (indivisible) values
5. **Consistent relationships**: Foreign key relationships are properly maintained

## Data Integrity

- **Referential Integrity**: Foreign key constraints through MongoDB references
- **Validation**: Schema validation at the application level using Mongoose
- **Uniqueness**: Unique indexes on email, compound unique indexes where needed
- **Cascading**: Soft deletes and proper cleanup of related data
