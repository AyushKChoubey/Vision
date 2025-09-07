# Vision-Cast Backend API

A comprehensive Node.js/Express backend API for the Vision-Cast AI content generation platform.

## Features

- 🔐 **JWT Authentication & Authorization** - Secure user authentication with refresh tokens
- 🎨 **AI Content Generation** - Image and video generation with customizable parameters
- 📱 **Social Media Integration** - Connect and manage multiple social media accounts
- 📊 **Analytics & Insights** - Comprehensive analytics for content performance
- 📝 **Template System** - Reusable content templates with variables
- 📈 **Usage Tracking** - Monitor API usage and enforce limits
- 🔔 **Notification System** - Real-time notifications for various events
- 🛡️ **Security** - Rate limiting, input validation, and data sanitization

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## Database Schema

The application uses MongoDB with the following main collections:

- **Users** - User accounts and authentication
- **Creations** - AI-generated images and videos
- **Posts** - Social media posts and scheduling
- **SocialAccounts** - Connected social media accounts
- **Templates** - Reusable content templates
- **Analytics** - Usage and performance analytics
- **Usage** - API usage tracking and limits
- **Notifications** - User notifications

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user
- `PATCH /me` - Update user profile
- `PATCH /update-password` - Update password
- `POST /forgot-password` - Request password reset
- `PATCH /reset-password/:token` - Reset password
- `POST /refresh` - Refresh access token

### Users (`/api/users`)
- `GET /profile` - Get user profile
- `PATCH /profile` - Update user profile
- `POST /avatar` - Upload user avatar
- `GET /dashboard` - Get dashboard data
- `GET /stats` - Get user statistics
- `GET /activity` - Get user activity
- `GET /settings` - Get user settings
- `PATCH /settings` - Update user settings

### Creations (`/api/creations`)
- `POST /` - Create new creation
- `GET /` - Get user's creations
- `GET /:id` - Get single creation
- `PATCH /:id` - Update creation
- `DELETE /:id` - Delete creation
- `GET /:id/download` - Download creation
- `GET /public` - Get public creations
- `GET /stats` - Get creation statistics

### Posts (`/api/posts`)
- `POST /` - Create new post
- `GET /` - Get user's posts
- `GET /:id` - Get single post
- `PATCH /:id` - Update post
- `DELETE /:id` - Delete post
- `POST /:id/publish` - Publish post immediately
- `GET /scheduled` - Get scheduled posts
- `PATCH /:id/engagement` - Update post engagement

### Social Media (`/api/social`)
- `POST /connect` - Connect social account
- `GET /accounts` - Get connected accounts
- `GET /accounts/:id` - Get single account
- `PATCH /accounts/:id` - Update account
- `DELETE /accounts/:id` - Disconnect account
- `POST /accounts/:id/sync` - Sync account data
- `GET /insights/:platform` - Get platform insights

### Analytics (`/api/analytics`)
- `GET /overview` - Get analytics overview
- `GET /creations` - Get creation analytics
- `GET /posts` - Get post analytics
- `GET /usage` - Get usage analytics
- `GET /platforms` - Get platform analytics
- `GET /trends` - Get analytics trends
- `GET /export` - Export analytics data

### Templates (`/api/templates`)
- `POST /` - Create new template
- `GET /` - Get user's templates
- `GET /:id` - Get single template
- `PATCH /:id` - Update template
- `DELETE /:id` - Delete template
- `POST /:id/use` - Use template
- `GET /public` - Get public templates
- `GET /search` - Search templates
- `GET /popular` - Get popular templates

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vision-cast
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-refresh-token-secret
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or install MongoDB locally
   # Follow MongoDB installation guide for your OS
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `EMAIL_HOST` | SMTP host for emails | No |
| `EMAIL_USER` | SMTP username | No |
| `EMAIL_PASS` | SMTP password | No |

## API Documentation

### Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Response Format

All API responses follow this format:
```json
{
  "status": "success|error",
  "message": "Optional message",
  "data": {
    // Response data
  }
}
```

### Error Handling

Errors are returned with appropriate HTTP status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per 15 minutes per IP address
- Different limits may apply to specific endpoints

## Development

### Project Structure
```
backend/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── scripts/         # Utility scripts
├── docs/           # Documentation
├── server.js       # Application entry point
└── package.json    # Dependencies and scripts
```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests

### Adding New Features

1. **Create Model** - Define data structure in `models/`
2. **Create Controller** - Implement business logic in `controllers/`
3. **Create Routes** - Define API endpoints in `routes/`
4. **Add Validation** - Add input validation in `middleware/validation.js`
5. **Update Documentation** - Update this README

## Security

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt for password security
- **Input Validation** - Comprehensive input validation
- **Rate Limiting** - Protection against abuse
- **CORS** - Cross-origin resource sharing configuration
- **Helmet** - Security headers
- **Data Sanitization** - Protection against NoSQL injection and XSS

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Deployment

### Using Docker

1. **Build the image**
   ```bash
   docker build -t vision-cast-backend .
   ```

2. **Run the container**
   ```bash
   docker run -p 5000:5000 --env-file .env vision-cast-backend
   ```

### Using PM2

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Start the application**
   ```bash
   pm2 start server.js --name vision-cast-api
   ```

3. **Save PM2 configuration**
   ```bash
   pm2 save
   pm2 startup
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
