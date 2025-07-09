import { Request, Response, NextFunction } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

// Middleware to validate request data using express-validator
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Execute all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    // Return validation errors
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field:
          typeof err === 'object' && 'path' in err
            ? err.path
            : typeof err === 'object' && 'param' in err
            ? err.param
            : String(err),
        message: typeof err === 'object' && 'msg' in err ? err.msg : 'Validation error',
      })),
    });
  };
};
