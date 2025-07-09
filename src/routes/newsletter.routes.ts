import express from 'express';
import { body } from 'express-validator';
import {
  subscribe,
  unsubscribe,
  getSubscribers,
  sendNewsletterToSubscribers
} from '../controllers/newsletter.controller';
import { protect, admin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = express.Router();

// Public routes
router.post(
  '/subscribe',
  validate([
    body('email').isEmail().withMessage('Please enter a valid email')
  ]),
  subscribe
);

router.post(
  '/unsubscribe',
  validate([
    body('email').isEmail().withMessage('Please enter a valid email')
  ]),
  unsubscribe
);

// Protected routes (admin only)
router.get('/subscribers', protect, admin, getSubscribers);

router.post(
  '/send',
  protect,
  admin,
  validate([
    body('subject').notEmpty().withMessage('Subject is required'),
    body('content').notEmpty().withMessage('Content is required')
  ]),
  sendNewsletterToSubscribers
);

export default router;