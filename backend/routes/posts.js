import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  publishPost,
  getScheduledPosts,
  updatePostEngagement,
  getPostStats
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import {
  validatePost,
  validatePagination,
  validateObjectId
} from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Post CRUD operations
router.post('/', validatePost, createPost);
router.get('/', validatePagination, getPosts);
router.get('/stats', validatePagination, getPostStats);
router.get('/scheduled', validatePagination, getScheduledPosts);
router.get('/:id', validateObjectId(), getPost);
router.patch('/:id', validateObjectId(), updatePost);
router.delete('/:id', validateObjectId(), deletePost);
router.post('/:id/publish', validateObjectId(), publishPost);
router.patch('/:id/engagement', validateObjectId(), updatePostEngagement);

export default router;
