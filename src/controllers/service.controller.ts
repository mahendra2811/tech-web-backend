import { Request, Response, NextFunction } from 'express';
import Service from '../models/service.model';

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const services = await Service.find().sort('title');
    
    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get service by ID or slug
// @route   GET /api/services/:id
// @access  Public
export const getService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if id is a valid ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    let service;
    if (isValidObjectId) {
      service = await Service.findById(id);
    } else {
      // If not a valid ObjectId, try to find by slug
      service = await Service.findOne({ slug: id });
    }
    
    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Service not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private (editor/admin)
export const createService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const service = await Service.create(req.body);
    
    res.status(201).json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (editor/admin)
export const updateService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const service = await Service.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Service not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (editor/admin)
export const deleteService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const service = await Service.findByIdAndDelete(id);
    
    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Service not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};