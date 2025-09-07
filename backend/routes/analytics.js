import express from 'express';
import {
  getAnalyticsOverview,
  getCreationAnalytics,
  getPostAnalytics,
  getUsageAnalytics,
  getPlatformAnalytics,
  getEntityAnalytics,
  getAnalyticsTrends,
  exportAnalytics
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';
import {
  validatePagination,
  validateObjectId
} from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Analytics routes
router.get('/overview', validatePagination, getAnalyticsOverview);
router.get('/creations', validatePagination, getCreationAnalytics);
router.get('/posts', validatePagination, getPostAnalytics);
router.get('/usage', validatePagination, getUsageAnalytics);
router.get('/platforms', validatePagination, getPlatformAnalytics);
router.get('/trends', validatePagination, getAnalyticsTrends);
router.get('/export', validatePagination, exportAnalytics);
router.get('/entity/:entityType/:entityId', validateObjectId('entityId'), getEntityAnalytics);

export default router;
