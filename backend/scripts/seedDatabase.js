import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Creation } from '../models/Creation.js';
import { Post } from '../models/Post.js';
import { Template } from '../models/Template.js';
import { Usage } from '../models/Usage.js';
import { SocialAccount } from '../models/SocialAccount.js';
import { Analytics } from '../models/Analytics.js';
import { Notification } from '../models/Notification.js';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  const users = [
    {
      email: 'admin@visioncast.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isEmailVerified: true,
      subscription: {
        plan: 'enterprise',
        isActive: true
      }
    },
    {
      email: 'john.doe@example.com',
      password: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Creative content creator and AI enthusiast',
      website: 'https://johndoe.com',
      location: 'San Francisco, CA',
      isEmailVerified: true,
      subscription: {
        plan: 'pro',
        isActive: true
      }
    },
    {
      email: 'jane.smith@example.com',
      password: 'Password123!',
      firstName: 'Jane',
      lastName: 'Smith',
      bio: 'Digital marketer and social media expert',
      location: 'New York, NY',
      isEmailVerified: true,
      subscription: {
        plan: 'free',
        isActive: true
      }
    }
  ];

  for (const userData of users) {
    const existingUser = await User.findByEmail(userData.email);
    if (!existingUser) {
      const user = await User.create(userData);
      console.log(`✅ Created user: ${user.email}`);
      
      // Create usage record
      const limits = {
        free: { images: 10, videos: 3, posts: 20 },
        pro: { images: 100, videos: 30, posts: 200 },
        enterprise: { images: 1000, videos: 300, posts: 2000 }
      };
      
      const userLimits = limits[user.subscription.plan] || limits.free;
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      
      await Usage.create({
        userId: user._id,
        period: 'monthly',
        periodStart,
        periodEnd,
        limits: userLimits
      });
    }
  }
};

const seedCreations = async () => {
  const users = await User.find({ role: { $ne: 'admin' } });
  
  for (const user of users) {
    const creationCount = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < creationCount; i++) {
      const types = ['image', 'video'];
      const styles = ['realistic', 'artistic', 'cartoon', 'abstract', 'cinematic', 'documentary'];
      const statuses = ['completed', 'generating', 'failed'];
      
      const creation = await Creation.create({
        userId: user._id,
        type: types[Math.floor(Math.random() * types.length)],
        title: `Sample ${types[Math.floor(Math.random() * types.length)]} ${i + 1}`,
        description: `This is a sample ${types[Math.floor(Math.random() * types.length)]} creation`,
        prompt: `Create a ${styles[Math.floor(Math.random() * styles.length)]} ${types[Math.floor(Math.random() * types.length)]} with vibrant colors and dynamic composition`,
        style: styles[Math.floor(Math.random() * styles.length)],
        size: '1024x1024',
        duration: types[Math.floor(Math.random() * types.length)] === 'video' ? 5 : undefined,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        fileUrl: `https://picsum.photos/1024/1024?random=${Date.now() + i}`,
        thumbnailUrl: `https://picsum.photos/200/200?random=${Date.now() + i}`,
        fileSize: Math.floor(Math.random() * 5000000) + 1000000,
        generationTime: Math.random() * 5 + 1,
        model: 'VisionCast AI Pro',
        tags: ['sample', 'demo', 'test'],
        isPublic: Math.random() > 0.5
      });
      
      console.log(`✅ Created creation: ${creation.title}`);
    }
  }
};

const seedPosts = async () => {
  const users = await User.find({ role: { $ne: 'admin' } });
  const creations = await Creation.find({ status: 'completed' });
  
  for (const user of users) {
    const userCreations = creations.filter(c => c.userId.toString() === user._id.toString());
    const postCount = Math.floor(Math.random() * 5) + 2;
    
    for (let i = 0; i < postCount && i < userCreations.length; i++) {
      const platforms = ['instagram', 'twitter', 'facebook', 'linkedin'];
      const statuses = ['posted', 'scheduled', 'draft'];
      
      const post = await Post.create({
        userId: user._id,
        creationId: userCreations[i]._id,
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        content: {
          caption: `Check out this amazing ${userCreations[i].type}! #AI #Creative #VisionCast`,
          hashtags: ['#AI', '#Creative', '#VisionCast', '#DigitalArt'],
          mentions: []
        },
        status: statuses[Math.floor(Math.random() * statuses.length)],
        scheduledAt: statuses[Math.floor(Math.random() * statuses.length)] === 'scheduled' ? 
          new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
        postedAt: statuses[Math.floor(Math.random() * statuses.length)] === 'posted' ? 
          new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
        engagement: {
          likes: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 100),
          shares: Math.floor(Math.random() * 50),
          views: Math.floor(Math.random() * 5000)
        }
      });
      
      console.log(`✅ Created post: ${post.platform} post for ${userCreations[i].title}`);
    }
  }
};

const seedTemplates = async () => {
  const users = await User.find({ role: { $ne: 'admin' } });
  
  const templateData = [
    {
      name: 'Instagram Marketing Post',
      description: 'Professional marketing template for Instagram',
      type: 'image',
      category: 'marketing',
      prompt: 'Create a professional marketing image for {{product}} with {{style}} style, featuring {{color}} colors and {{mood}} mood',
      style: 'realistic',
      tags: ['marketing', 'instagram', 'professional'],
      isPublic: true,
      metadata: {
        variables: [
          { name: 'product', type: 'text', required: true, description: 'Product or service name' },
          { name: 'style', type: 'select', options: ['modern', 'vintage', 'minimalist'], required: true },
          { name: 'color', type: 'text', defaultValue: 'blue and white' },
          { name: 'mood', type: 'select', options: ['energetic', 'calm', 'professional'], defaultValue: 'professional' }
        ]
      }
    },
    {
      name: 'Product Showcase Video',
      description: 'Dynamic product showcase video template',
      type: 'video',
      category: 'commercial',
      prompt: 'Create a {{duration}} second video showcasing {{product}} with {{style}} cinematography, {{lighting}} lighting, and {{music}} music',
      style: 'cinematic',
      tags: ['video', 'product', 'showcase'],
      isPublic: true,
      metadata: {
        variables: [
          { name: 'product', type: 'text', required: true, description: 'Product to showcase' },
          { name: 'duration', type: 'select', options: ['5', '10', '15', '30'], defaultValue: '10' },
          { name: 'style', type: 'select', options: ['cinematic', 'documentary', 'commercial'], defaultValue: 'cinematic' },
          { name: 'lighting', type: 'select', options: ['natural', 'studio', 'dramatic'], defaultValue: 'studio' },
          { name: 'music', type: 'select', options: ['upbeat', 'calm', 'epic'], defaultValue: 'upbeat' }
        ]
      }
    }
  ];
  
  for (const user of users) {
    for (const template of templateData) {
      const existingTemplate = await Template.findOne({
        userId: user._id,
        name: template.name
      });
      
      if (!existingTemplate) {
        const newTemplate = await Template.create({
          ...template,
          userId: user._id,
          usageCount: Math.floor(Math.random() * 20)
        });
        
        console.log(`✅ Created template: ${newTemplate.name} for ${user.email}`);
      }
    }
  }
};

const seedSocialAccounts = async () => {
  const users = await User.find({ role: { $ne: 'admin' } });
  
  for (const user of users) {
    const platforms = ['instagram', 'twitter', 'facebook'];
    const accountCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < accountCount; i++) {
      const platform = platforms[i];
      
      const existingAccount = await SocialAccount.findByPlatform(user._id, platform);
      if (!existingAccount) {
        const account = await SocialAccount.create({
          userId: user._id,
          platform,
          platformUserId: `user_${user._id}_${platform}`,
          platformUsername: `${user.firstName.toLowerCase()}_${platform}`,
          accessToken: `encrypted_token_${Date.now()}`,
          isActive: true,
          profileData: {
            name: `${user.firstName} ${user.lastName}`,
            followers: Math.floor(Math.random() * 10000) + 100,
            following: Math.floor(Math.random() * 1000) + 50,
            posts: Math.floor(Math.random() * 500) + 10
          }
        });
        
        console.log(`✅ Created social account: ${platform} for ${user.email}`);
      }
    }
  }
};

const seedAnalytics = async () => {
  const users = await User.find();
  const creations = await Creation.find();
  const posts = await Post.find();
  
  // Create analytics for creations
  for (const creation of creations) {
    await Analytics.create({
      userId: creation.userId,
      type: 'creation',
      entityId: creation._id,
      entityType: 'Creation',
      metrics: {
        generationTime: creation.generationTime,
        fileSize: creation.fileSize,
        status: creation.status,
        model: creation.model,
        style: creation.style
      },
      date: creation.createdAt
    });
  }
  
  // Create analytics for posts
  for (const post of posts) {
    await Analytics.create({
      userId: post.userId,
      type: 'post',
      entityId: post._id,
      entityType: 'Post',
      metrics: {
        platform: post.platform,
        status: post.status,
        engagement: post.engagement
      },
      date: post.createdAt
    });
  }
  
  console.log(`✅ Created analytics records`);
};

const seedNotifications = async () => {
  const users = await User.find();
  
  for (const user of users) {
    const notificationCount = Math.floor(Math.random() * 5) + 3;
    
    for (let i = 0; i < notificationCount; i++) {
      const types = ['generation_complete', 'post_scheduled', 'post_published', 'system'];
      const priorities = ['low', 'medium', 'high'];
      
      await Notification.create({
        userId: user._id,
        type: types[Math.floor(Math.random() * types.length)],
        title: `Sample notification ${i + 1}`,
        message: `This is a sample notification for ${user.firstName}`,
        isRead: Math.random() > 0.5,
        priority: priorities[Math.floor(Math.random() * priorities.length)]
      });
    }
    
    console.log(`✅ Created notifications for ${user.email}`);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    await seedUsers();
    await seedCreations();
    await seedPosts();
    await seedTemplates();
    await seedSocialAccounts();
    await seedAnalytics();
    await seedNotifications();
    
    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
