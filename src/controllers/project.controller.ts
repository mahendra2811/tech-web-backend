import { Request, Response, NextFunction } from 'express';
import Project from '../models/project.model';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { 
      category, 
      featured, 
      search, 
      limit = 10, 
      page = 1, 
      sort = '-createdAt' 
    } = req.query;

    // Build query
    const query: any = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const projects = await Project.find(query)
      .sort(sort as string)
      .limit(Number(limit))
      .skip(skip);

    // Get total count
    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      projects,
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

// @desc    Get project categories
// @route   GET /api/projects/categories
// @access  Public
export const getProjectCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get distinct categories
    const categories = await Project.distinct('category');
    
    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project by ID or slug
// @route   GET /api/projects/:id
// @access  Public
export const getProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if id is a valid ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    let project;
    if (isValidObjectId) {
      project = await Project.findById(id);
    } else {
      // If not a valid ObjectId, try to find by slug
      project = await Project.findOne({ slug: id });
    }
    
    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (editor/admin)
export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.create(req.body);
    
    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (editor/admin)
export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const project = await Project.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (editor/admin)
export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};