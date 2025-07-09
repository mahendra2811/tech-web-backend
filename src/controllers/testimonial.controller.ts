import { Request, Response, NextFunction } from 'express';
import Testimonial from '../models/testimonial.model';

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { featured, limit = 10, page = 1 } = req.query;

    // Build query
    const query: any = {};

    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const testimonials = await Testimonial.find(query)
      .sort('-createdAt')
      .limit(Number(limit))
      .skip(skip);

    // Get total count
    const total = await Testimonial.countDocuments(query);

    res.status(200).json({
      success: true,
      testimonials,
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

// @desc    Get testimonial by ID
// @route   GET /api/testimonials/:id
// @access  Public
export const getTestimonial = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const testimonial = await Testimonial.findById(id);
    
    if (!testimonial) {
      res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      testimonial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private (editor/admin)
export const createTestimonial = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const testimonial = await Testimonial.create(req.body);
    
    res.status(201).json({
      success: true,
      testimonial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (editor/admin)
export const updateTestimonial = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!testimonial) {
      res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      testimonial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (editor/admin)
export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const testimonial = await Testimonial.findByIdAndDelete(id);
    
    if (!testimonial) {
      res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};