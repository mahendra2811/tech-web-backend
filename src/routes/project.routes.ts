import express from 'express';
import { body } from 'express-validator';
import {
  getProjects,
  getProjectCategories,
  getProject,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/project.controller';
import { protect, editor } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/categories', getProjectCategories);
router.get('/:id', getProject);

// Protected routes (require authentication and editor/admin role)
router.post(
  '/',
  protect,
  editor,
  validate([
    body('title').notEmpty().withMessage('Title is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('technologies').isArray().withMessage('Technologies must be an array'),
    body('projectDate').isISO8601().withMessage('Project date must be a valid date')
  ]),
  createProject
);

router.put(
  '/:id',
  protect,
  editor,
  validate([
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('category').optional().notEmpty().withMessage('Category cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('technologies').optional().isArray().withMessage('Technologies must be an array'),
    body('projectDate').optional().isISO8601().withMessage('Project date must be a valid date')
  ]),
  updateProject
);

router.delete('/:id', protect, editor, deleteProject);

export default router;