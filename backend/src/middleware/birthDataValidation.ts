import { Request, Response, NextFunction } from 'express';

export interface BirthDataRequest extends Request {
  body: {
    dateOfBirth?: string | Date;
    timeOfBirth?: string;
    placeOfBirth?: string;
  };
}

/**
 * Validates birth data from request body
 * Validates:
 * - Date of birth (not future, valid format)
 * - Time of birth (HH:MM format)
 * - Place of birth (non-empty string)
 * 
 * Requirement 1.4: When a user enters invalid birth data (future date, invalid time format, empty fields),
 * THE System SHALL display a clear error message and prevent submission
 */
export const validateBirthData = (
  req: BirthDataRequest,
  res: Response,
  next: NextFunction
): void => {
  const { dateOfBirth, timeOfBirth, placeOfBirth } = req.body;

  // Validate date of birth
  if (!dateOfBirth) {
    res.status(400).json({
      status: 'error',
      message: 'Date of birth is required'
    });
    return;
  }

  const birthDate = new Date(dateOfBirth);
  
  // Check if date is valid
  if (isNaN(birthDate.getTime())) {
    res.status(400).json({
      status: 'error',
      message: 'Date of birth must be in a valid format (YYYY-MM-DD)'
    });
    return;
  }

  // Check if date is in the future
  if (birthDate > new Date()) {
    res.status(400).json({
      status: 'error',
      message: 'Birth date cannot be in the future'
    });
    return;
  }

  // Validate time of birth
  if (!timeOfBirth) {
    res.status(400).json({
      status: 'error',
      message: 'Time of birth is required'
    });
    return;
  }

  // Check time format (HH:MM in 24-hour format)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(timeOfBirth)) {
    res.status(400).json({
      status: 'error',
      message: 'Please enter time in HH:MM format (24-hour)'
    });
    return;
  }

  // Validate place of birth
  if (placeOfBirth === undefined || placeOfBirth === null) {
    res.status(400).json({
      status: 'error',
      message: 'Place of birth is required'
    });
    return;
  }

  // Check if place of birth is a non-empty string
  if (typeof placeOfBirth !== 'string' || placeOfBirth.trim().length === 0) {
    res.status(400).json({
      status: 'error',
      message: 'Place of birth must be a non-empty string'
    });
    return;
  }

  // Check minimum length for place of birth
  if (placeOfBirth.trim().length < 2) {
    res.status(400).json({
      status: 'error',
      message: 'Place of birth must be at least 2 characters'
    });
    return;
  }

  // All validations passed, proceed to next middleware
  next();
};
