import express from 'express';
import { body } from 'express-validator';
import {
  submitContactForm,
  getContactSubmissions,
  updateSubmissionStatus,
  deleteSubmission
} from '../controllers/contact.controller';
import { protect, admin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = express.Router();

// Public routes
router.post(
  '/',
  validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
  ]),
  submitContactForm
);

// Protected routes (admin only)
router.get('/submissions', protect, admin, getContactSubmissions);

router.put(
  '/submissions/:id/status',
  protect,
  admin,
  validate([
    body('status').isIn(['new', 'read', 'responded', 'archived']).withMessage('Invalid status')
  ]),
  updateSubmissionStatus
);

router.delete('/submissions/:id', protect, admin, deleteSubmission);

export default router;