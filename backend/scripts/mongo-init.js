// MongoDB initialization script
db = db.getSiblingDB('vision-cast');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'firstName'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        },
        password: {
          bsonType: 'string',
          minLength: 8
        },
        firstName: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 50
        }
      }
    }
  }
});

db.createCollection('creations');
db.createCollection('posts');
db.createCollection('socialaccounts');
db.createCollection('templates');
db.createCollection('analytics');
db.createCollection('usage');
db.createCollection('notifications');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ isActive: 1 });
db.users.createIndex({ createdAt: 1 });

db.creations.createIndex({ userId: 1 });
db.creations.createIndex({ type: 1 });
db.creations.createIndex({ status: 1 });
db.creations.createIndex({ createdAt: -1 });
db.creations.createIndex({ userId: 1, type: 1 });
db.creations.createIndex({ isPublic: 1, createdAt: -1 });

db.posts.createIndex({ userId: 1 });
db.posts.createIndex({ creationId: 1 });
db.posts.createIndex({ platform: 1 });
db.posts.createIndex({ status: 1 });
db.posts.createIndex({ scheduledAt: 1 });

db.socialaccounts.createIndex({ userId: 1 });
db.socialaccounts.createIndex({ platform: 1 });
db.socialaccounts.createIndex({ userId: 1, platform: 1 }, { unique: true });

db.templates.createIndex({ userId: 1 });
db.templates.createIndex({ type: 1 });
db.templates.createIndex({ category: 1 });
db.templates.createIndex({ isPublic: 1 });
db.templates.createIndex({ usageCount: -1 });

db.analytics.createIndex({ userId: 1 });
db.analytics.createIndex({ type: 1 });
db.analytics.createIndex({ date: -1 });
db.analytics.createIndex({ entityId: 1 });

db.usage.createIndex({ userId: 1 });
db.usage.createIndex({ period: 1 });
db.usage.createIndex({ periodStart: 1 });
db.usage.createIndex({ userId: 1, period: 1, periodStart: 1 }, { unique: true });

db.notifications.createIndex({ userId: 1 });
db.notifications.createIndex({ isRead: 1 });
db.notifications.createIndex({ createdAt: -1 });
db.notifications.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

print('✅ Vision-Cast database initialized successfully!');
