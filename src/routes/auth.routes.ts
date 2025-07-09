import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = express.Router();

// Public routes
router.post(
  '/register',
  validate([
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required')
  ]),
  register
);

router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ]),
  login
);

router.post(
  '/refresh-token',
  validate([
    body('refreshToken').notEmpty().withMessage('Refresh token is required')
  ]),
  refreshToken
);

router.post(
  '/forgot-password',
  validate([
    body('email').isEmail().withMessage('Please enter a valid email')
  ]),
  forgotPassword
);

router.post(
  '/reset-password',
  validate([
    body('token').notEmpty().withMessage('Token is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ]),
  resetPassword
);

// Protected routes
router.get('/me', protect, getMe);

router.put(
  '/me',
  protect,
  validate([
    body('email').optional().isEmail().withMessage('Please enter a valid email'),
    body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().notEmpty().withMessage('Last name cannot be empty')
  ]),
  updateProfile
);

router.put(
  '/change-password',
  protect,
  validate([
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters')
  ]),
  changePassword
);

export default router;