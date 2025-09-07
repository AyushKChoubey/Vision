import express from 'express';
import {
  createTemplate,
  getTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
  useTemplate,
  getPublicTemplates,
  searchTemplates,
  getPopularTemplates,
  getTemplateStats,
  addTemplateVariable,
  removeTemplateVariable
} from '../controllers/templateController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import {
  validateTemplate,
  validatePagination,
  validateObjectId
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/public', validatePagination, getPublicTemplates);
router.get('/popular', getPopularTemplates);

// Protected routes
router.use(protect);

// Template CRUD operations
router.post('/', validateTemplate, createTemplate);
router.get('/', validatePagination, getTemplates);
router.get('/search', validatePagination, searchTemplates);
router.get('/stats', getTemplateStats);
router.get('/:id', validateObjectId(), getTemplate);
router.patch('/:id', validateObjectId(), updateTemplate);
router.delete('/:id', validateObjectId(), deleteTemplate);
router.post('/:id/use', validateObjectId(), useTemplate);

// Template variables
router.post('/:id/variables', validateObjectId(), addTemplateVariable);
router.delete('/:id/variables/:variableName', validateObjectId(), removeTemplateVariable);

export default router;
