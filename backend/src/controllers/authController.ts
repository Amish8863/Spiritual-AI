import { Response } from 'express';
import { User } from '../models/User';
import { generateToken, AuthRequest } from '../middleware/auth';

interface RegisterRequestBody {
  email: string;
  password: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password, dateOfBirth, timeOfBirth, placeOfBirth } =
      req.body as RegisterRequestBody;

    // Validate required fields
    if (!email || !password || !dateOfBirth || !timeOfBirth || !placeOfBirth) {
      res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({
        status: 'error',
        message: 'User with this email already exists'
      });
      return;
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      dateOfBirth: new Date(dateOfBirth),
      timeOfBirth,
      placeOfBirth
    });

    // Save user to database
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString());

    // Return success response
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        userId: user._id,
        email: user.email,
        token
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
          message: error.message || 'Registration failed'
        });
      }
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Registration failed'
      });
    }
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequestBody;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
      return;
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
      return;
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
      return;
    }

    // Generate JWT token
    const token = generateToken(user._id.toString());

    // Return success response
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        userId: user._id,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        timeOfBirth: user.timeOfBirth,
        placeOfBirth: user.placeOfBirth,
        zodiacSign: user.zodiacSign,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Login failed'
    });
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        userId: user._id,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        timeOfBirth: user.timeOfBirth,
        placeOfBirth: user.placeOfBirth,
        zodiacSign: user.zodiacSign,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to fetch user'
    });
  }
};
