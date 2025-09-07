import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateMe,
  updatePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
  verifyEmail,
  resendVerification,
  deleteAccount
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validatePasswordChange
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.post('/refresh', refreshToken);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.post('/logout', logout);
router.get('/me', getMe);
router.patch('/me', validateUserUpdate, updateMe);
router.patch('/update-password', validatePasswordChange, updatePassword);
router.post('/resend-verification', resendVerification);
router.delete('/delete-account', deleteAccount);

export default router;
