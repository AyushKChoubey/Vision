import express from 'express';
import {
  connectSocialAccount,
  getSocialAccounts,
  getSocialAccount,
  updateSocialAccount,
  disconnectSocialAccount,
  syncSocialAccount,
  getSocialStats,
  getPlatformInsights
} from '../controllers/socialController.js';
import { protect } from '../middleware/auth.js';
import {
  validateSocialAccount,
  validatePagination,
  validateObjectId
} from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Social account management
router.post('/connect', validateSocialAccount, connectSocialAccount);
router.get('/accounts', getSocialAccounts);
router.get('/stats', validatePagination, getSocialStats);
router.get('/accounts/:id', validateObjectId(), getSocialAccount);
router.patch('/accounts/:id', validateObjectId(), updateSocialAccount);
router.delete('/accounts/:id', validateObjectId(), disconnectSocialAccount);
router.post('/accounts/:id/sync', validateObjectId(), syncSocialAccount);

// Platform insights
router.get('/insights/:platform', getPlatformInsights);

export default router;
