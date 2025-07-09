import { Request, Response, NextFunction } from 'express';
import NewsletterSubscription from '../models/newsletter.model';
import { sendNewsletter } from '../services/email.service';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;

    // Check if already subscribed
    const existingSubscription = await NewsletterSubscription.findOne({ email });

    if (existingSubscription) {
      // If already subscribed but unsubscribed, reactivate
      if (existingSubscription.status === 'unsubscribed') {
        existingSubscription.status = 'active';
        await existingSubscription.save();

        res.status(200).json({
          success: true,
          message: 'Your subscription has been reactivated'
        });
        return;
      }

      // Already subscribed and active
      res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter'
      });
      return;
    }

    // Create new subscription
    await NewsletterSubscription.create({ email });

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to our newsletter'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
export const unsubscribe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;

    // Find subscription
    const subscription = await NewsletterSubscription.findOne({ email });

    if (!subscription) {
      res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
      return;
    }

    // Update status to unsubscribed
    subscription.status = 'unsubscribed';
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'You have been unsubscribed from our newsletter'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all subscribers
// @route   GET /api/newsletter/subscribers
// @access  Private (admin only)
export const getSubscribers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, limit = 10, page = 1 } = req.query;

    // Build query
    const query: any = {};

    if (status) {
      query.status = status;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const subscribers = await NewsletterSubscription.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    // Get total count
    const total = await NewsletterSubscription.countDocuments(query);

    res.status(200).json({
      success: true,
      subscribers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send newsletter to subscribers
// @route   POST /api/newsletter/send
// @access  Private (admin only)
export const sendNewsletterToSubscribers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { subject, content } = req.body;

    // Get active subscribers
    const activeSubscribers = await NewsletterSubscription.find({ status: 'active' });

    if (activeSubscribers.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No active subscribers found'
      });
      return;
    }

    // Get subscriber emails
    const subscriberEmails = activeSubscribers.map(subscriber => subscriber.email);

    // Send newsletter
    await sendNewsletter(subscriberEmails, subject, content);

    // Update lastEmailSent for all subscribers
    await NewsletterSubscription.updateMany(
      { status: 'active' },
      { lastEmailSent: new Date() }
    );

    res.status(200).json({
      success: true,
      message: `Newsletter sent to ${subscriberEmails.length} subscribers`,
      count: subscriberEmails.length
    });
  } catch (error) {
    next(error);
  }
};