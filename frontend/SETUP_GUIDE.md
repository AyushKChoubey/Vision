# Vision-Cast Full Stack Setup Guide

This guide will help you set up the complete Vision-Cast application with both frontend and backend components.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)
- **Docker** (optional) - [Download here](https://www.docker.com/)

## Quick Start with Docker

If you have Docker installed, you can get everything running quickly:

```bash
# Clone the repository
git clone <your-repo-url>
cd Vision-Cast

# Start all services with Docker Compose
cd backend
docker-compose up -d

# The API will be available at http://localhost:5000
# MongoDB will be available at localhost:27017
```

## Manual Setup

### 1. Backend Setup

#### Step 1: Install Dependencies
```bash
cd backend
npm install
```

#### Step 2: Environment Configuration
```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your configuration
nano .env
```

**Required Environment Variables:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vision-cast
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-refresh-token-secret-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Step 3: Start MongoDB
```bash
# Using Docker (recommended)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install MongoDB locally and start the service
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

#### Step 4: Seed the Database (Optional)
```bash
npm run seed
```

This will create sample users, creations, posts, and templates for testing.

#### Step 5: Start the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The backend API will be available at `http://localhost:5000`

### 2. Frontend Setup

#### Step 1: Install Dependencies
```bash
# From the root directory
npm install
```

#### Step 2: Update API Configuration
Update the frontend to connect to your backend API. In your frontend code, update the API base URL:

```javascript
// In your frontend configuration
const API_BASE_URL = 'http://localhost:5000/api';
```

#### Step 3: Start the Frontend
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Testing

### Test the API with Sample Data

After seeding the database, you can test the API with these sample accounts:

**Admin Account:**
- Email: `admin@visioncast.com`
- Password: `Admin123!`

**Regular User:**
- Email: `john.doe@example.com`
- Password: `Password123!`

### API Endpoints

**Authentication:**
```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"Password123!"}'
```

**Get Dashboard Data:**
```bash
# Get user dashboard (replace TOKEN with actual JWT token)
curl -X GET http://localhost:5000/api/users/dashboard \
  -H "Authorization: Bearer TOKEN"
```

## Database Schema

The application uses MongoDB with the following main collections:

### Users Collection
- User authentication and profile information
- Subscription and preferences
- Account status and verification

### Creations Collection
- AI-generated images and videos
- Generation parameters and metadata
- File URLs and thumbnails

### Posts Collection
- Social media posts and scheduling
- Platform-specific content
- Engagement metrics

### SocialAccounts Collection
- Connected social media accounts
- Platform credentials (encrypted)
- Profile data and permissions

### Templates Collection
- Reusable content templates
- Variable definitions
- Usage tracking

### Analytics Collection
- Usage and performance metrics
- User activity tracking
- Platform insights

### Usage Collection
- API usage limits and tracking
- Subscription-based quotas
- Period-based reset

### Notifications Collection
- User notifications
- System alerts
- Email and push notifications

## Features Overview

### 🔐 Authentication & Authorization
- JWT-based authentication
- Refresh token support
- Role-based access control
- Password reset functionality

### 🎨 Content Generation
- AI image generation
- AI video generation
- Customizable parameters
- Style and quality options

### 📱 Social Media Integration
- Multiple platform support (Instagram, Twitter, Facebook, LinkedIn)
- Post scheduling
- Engagement tracking
- Platform insights

### 📊 Analytics & Insights
- Content performance metrics
- User activity tracking
- Platform analytics
- Usage statistics

### 📝 Template System
- Reusable content templates
- Variable substitution
- Public template sharing
- Usage tracking

### 🔔 Notification System
- Real-time notifications
- Email notifications
- System alerts
- User preferences

## Development

### Project Structure
```
Vision-Cast/
├── backend/                 # Node.js/Express API
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── scripts/           # Utility scripts
│   └── server.js          # Application entry point
├── src/                   # React frontend
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── context/          # React context
│   └── assets/           # Static assets
└── README.md
```

### Adding New Features

1. **Backend:**
   - Create model in `backend/models/`
   - Create controller in `backend/controllers/`
   - Create routes in `backend/routes/`
   - Add validation in `backend/middleware/validation.js`

2. **Frontend:**
   - Create components in `src/components/`
   - Create pages in `src/pages/`
   - Update routing in `src/App.jsx`
   - Add API calls to backend

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vision-cast
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Deployment

### Using Docker Compose

1. **Production Environment:**
```bash
# Update docker-compose.yml with production settings
# Set NODE_ENV=production
# Update environment variables
docker-compose up -d
```

2. **With SSL/HTTPS:**
```bash
# Add SSL certificates to ./ssl/ directory
# Update nginx.conf for SSL configuration
docker-compose up -d
```

### Manual Deployment

1. **Backend:**
```bash
cd backend
npm install --production
npm start
```

2. **Frontend:**
```bash
npm run build
# Serve the build directory with a web server
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check connection string in .env
   - Verify network connectivity

2. **JWT Token Issues:**
   - Check JWT_SECRET is set
   - Verify token expiration
   - Ensure proper token format

3. **Cloudinary Upload Errors:**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper file formats

4. **CORS Issues:**
   - Update ALLOWED_ORIGINS in .env
   - Check frontend URL configuration
   - Verify CORS middleware setup

### Logs and Debugging

**Backend Logs:**
```bash
# Development
npm run dev

# Production
npm start
# Check logs in your deployment platform
```

**Database Logs:**
```bash
# MongoDB logs
docker logs mongodb

# Or check MongoDB log files
tail -f /var/log/mongodb/mongod.log
```

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review the API documentation
3. Check the GitHub issues
4. Contact the development team

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
