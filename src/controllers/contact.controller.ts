import { Request, Response, NextFunction } from 'express';
import ContactSubmission from '../models/contact.model';
import { sendContactNotificationEmail } from '../services/email.service';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Create new submission
    const submission = await ContactSubmission.create({
      name,
      email,
      subject,
      message
    });
    
    // Send notification email to admin
    try {
      await sendContactNotificationEmail({
        name,
        email,
        subject,
        message
      });
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Continue execution even if email fails
    }
    
    res.status(201).json({
      success: true,
      message: 'Your message has been received. We\'ll get back to you soon!',
      submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact submissions
// @route   GET /api/contact/submissions
// @access  Private (admin only)
export const getContactSubmissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    const submissions = await ContactSubmission.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);
    
    // Get total count
    const total = await ContactSubmission.countDocuments(query);
    
    res.status(200).json({
      success: true,
      submissions,
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

// @desc    Update submission status
// @route   PUT /api/contact/submissions/:id/status
// @access  Private (admin only)
export const updateSubmissionStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const submission = await ContactSubmission.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!submission) {
      res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete submission
// @route   DELETE /api/contact/submissions/:id
// @access  Private (admin only)
export const deleteSubmission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const submission = await ContactSubmission.findByIdAndDelete(id);
    
    if (!submission) {
      res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};