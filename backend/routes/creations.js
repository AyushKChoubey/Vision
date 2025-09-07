import express from 'express';
import {
  createCreation,
  getCreations,
  getCreation,
  updateCreation,
  deleteCreation,
  downloadCreation,
  getPublicCreations,
  getCreationStats
} from '../controllers/creationController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import {
  validateCreation,
  validateCreationUpdate,
  validatePagination,
  validateObjectId
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/public', validatePagination, getPublicCreations);

// Protected routes
router.use(protect);

// Creation CRUD operations
router.post('/', validateCreation, createCreation);
router.get('/', validatePagination, getCreations);
router.get('/stats', validatePagination, getCreationStats);
router.get('/:id', validateObjectId(), getCreation);
router.patch('/:id', validateObjectId(), validateCreationUpdate, updateCreation);
router.delete('/:id', validateObjectId(), deleteCreation);
router.get('/:id/download', validateObjectId(), downloadCreation);

export default router;
