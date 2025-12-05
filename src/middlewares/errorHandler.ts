import { Request, Response, NextFunction } from 'express';
import { sendError } from '@/utils/response';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // PostgreSQL errors
  if (err.name === 'QueryError' || err.message.includes('violates')) {
    return sendError(res, 'Database error occurred', 500);
  }

  // Validation errors
  if (err.name === 'ValidationError' || err.name === 'ZodError') {
    return sendError(res, err.message, 400);
  }

  // Default error
  return sendError(res, err.message || 'Internal server error', 500);
};

