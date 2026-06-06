import { Response } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

interface BirthDataRequestBody {
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
}

/**
 * Save or update user's birth data
 * POST /api/users/birth-data
 * 
 * Requirement 1.3: WHEN valid birth data is stored in Redux, THE System SHALL persist the data to MongoDB after user authentication
 * Requirement 17.2: WHEN a user authenticates, THE System SHALL persist birth data to MongoDB
 */
export const saveBirthData = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { dateOfBirth, timeOfBirth, placeOfBirth } =
      req.body as BirthDataRequestBody;

    // Validate that user is authenticated
    if (!req.userId) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    // Validate required fields
    if (!dateOfBirth || !timeOfBirth || !placeOfBirth) {
      res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      });
      return;
    }

    // Find user by ID
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
      return;
    }

    // Update user's birth data
    user.dateOfBirth = new Date(dateOfBirth);
    user.timeOfBirth = timeOfBirth;
    user.placeOfBirth = placeOfBirth;

    // Save updated user
    await user.save();

    // Return success response
    res.status(200).json({
      status: 'success',
      message: 'Birth data saved successfully',
      data: {
        userId: user._id,
        dateOfBirth: user.dateOfBirth,
        timeOfBirth: user.timeOfBirth,
        placeOfBirth: user.placeOfBirth,
        zodiacSign: user.zodiacSign
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      // Handle validation errors
      if (error.message.includes('validation failed')) {
        res.status(400).json({
          status: 'error',
          message: error.message
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: error.message || 'Failed to save birth data'
        });
      }
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Failed to save birth data'
      });
    }
  }
};

/**
 * Retrieve user's birth data
 * GET /api/users/birth-data
 * 
 * Requirement 1.5: WHEN a user returns to the application, THE System SHALL retrieve and restore their previously saved birth data from MongoDB
 * Requirement 17.4: WHEN a user logs back in, THE System SHALL retrieve their saved birth data from MongoDB
 */
export const getBirthData = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Validate that user is authenticated
    if (!req.userId) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    // Find user by ID
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
      return;
    }

    // Check if user has birth data
    if (!user.dateOfBirth || !user.timeOfBirth || !user.placeOfBirth) {
      res.status(404).json({
        status: 'error',
        message: 'No birth data found for this user'
      });
      return;
    }

    // Return birth data
    res.status(200).json({
      status: 'success',
      data: {
        userId: user._id,
        dateOfBirth: user.dateOfBirth,
        timeOfBirth: user.timeOfBirth,
        placeOfBirth: user.placeOfBirth,
        zodiacSign: user.zodiacSign
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to retrieve birth data'
    });
  }
};
