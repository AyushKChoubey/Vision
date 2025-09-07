import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  getDashboard,
  getUserStats,
  getUserActivity,
  getUserSettings,
  updateUserSettings,
  getUserCreations,
  getUserPosts,
  deleteUserAccount
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';
import {
  validateUserUpdate,
  validatePagination
} from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.patch('/profile', validateUserUpdate, updateProfile);
router.post('/avatar', upload.single('avatar'), uploadAvatar);

// Dashboard and statistics
router.get('/dashboard', getDashboard);
router.get('/stats', validatePagination, getUserStats);
router.get('/activity', validatePagination, getUserActivity);

// Settings
router.get('/settings', getUserSettings);
router.patch('/settings', updateUserSettings);

// User content
router.get('/creations', validatePagination, getUserCreations);
router.get('/posts', validatePagination, getUserPosts);

// Account management
router.delete('/account', deleteUserAccount);

export default router;
