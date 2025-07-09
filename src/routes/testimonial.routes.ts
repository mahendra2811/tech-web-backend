import express from 'express';
import { body } from 'express-validator';
import {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../controllers/testimonial.controller';
import { protect, editor } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = express.Router();

// Public routes
router.get('/', getTestimonials);
router.get('/:id', getTestimonial);

// Protected routes (require authentication and editor/admin role)
router.post(
  '/',
  protect,
  editor,
  validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('position').notEmpty().withMessage('Position is required'),
    body('company').notEmpty().withMessage('Company is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5')
  ]),
  createTestimonial
);

router.put(
  '/:id',
  protect,
  editor,
  validate([
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('position').optional().notEmpty().withMessage('Position cannot be empty'),
    body('company').optional().notEmpty().withMessage('Company cannot be empty'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty'),
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5')
  ]),
  updateTestimonial
);

router.delete('/:id', protect, editor, deleteTestimonial);

export default router;