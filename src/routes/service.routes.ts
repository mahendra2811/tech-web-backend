import express from 'express';
import { body } from 'express-validator';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
} from '../controllers/service.controller';
import { protect, editor } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/:id', getService);

// Protected routes (require authentication and editor/admin role)
router.post(
  '/',
  protect,
  editor,
  validate([
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('icon').notEmpty().withMessage('Icon is required')
  ]),
  createService
);

router.put(
  '/:id',
  protect,
  editor,
  validate([
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('icon').optional().notEmpty().withMessage('Icon cannot be empty')
  ]),
  updateService
);

router.delete('/:id', protect, editor, deleteService);

export default router;