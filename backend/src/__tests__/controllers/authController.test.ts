import mongoose from 'mongoose';
import { Response } from 'express';
import { register, login, getCurrentUser } from '../../controllers/authController';
import { User } from '../../models/User';
import { AuthRequest } from '../../middleware/auth';

describe('Auth Controller', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/premium-astrology-test';
    await mongoose.connect(mongoUri);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('Register', () => {
    it('should register a new user successfully', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          dateOfBirth: '1990-01-15',
          timeOfBirth: '14:30',
          placeOfBirth: 'New York'
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'User registered successfully',
          data: expect.objectContaining({
            email: 'test@example.com',
            token: expect.any(String)
          })
        })
      );
    });

    it('should reject registration with missing fields', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
          // Missing other fields
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'All fields are required'
        })
      );
    });

    it('should reject registration with duplicate email', async () => {
      // Create first user
      await User.create({
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      });

      // Try to register with same email
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          dateOfBirth: '1990-01-15',
          timeOfBirth: '14:30',
          placeOfBirth: 'New York'
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'User with this email already exists'
        })
      );
    });

    it('should handle case-insensitive email', async () => {
      const req = {
        body: {
          email: 'Test@EXAMPLE.COM',
          password: 'password123',
          dateOfBirth: '1990-01-15',
          timeOfBirth: '14:30',
          placeOfBirth: 'New York'
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      const callArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(callArgs.data.email).toBe('test@example.com');
    });
  });

  describe('Login', () => {
    beforeEach(async () => {
      // Create a test user
      await User.create({
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      });
    });

    it('should login user with correct credentials', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'Login successful',
          data: expect.objectContaining({
            email: 'test@example.com',
            token: expect.any(String)
          })
        })
      );
    });

    it('should reject login with missing email', async () => {
      const req = {
        body: {
          password: 'password123'
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Email and password are required'
        })
      );
    });

    it('should reject login with missing password', async () => {
      const req = {
        body: {
          email: 'test@example.com'
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Email and password are required'
        })
      );
    });

    it('should reject login with non-existent email', async () => {
      const req = {
        body: {
          email: 'nonexistent@example.com',
          password: 'password123'
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Invalid email or password'
        })
      );
    });

    it('should reject login with incorrect password', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'wrongpassword'
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Invalid email or password'
        })
      );
    });

    it('should return user data on successful login', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await login(req, res);

      const callArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(callArgs.data).toMatchObject({
        email: 'test@example.com',
        dateOfBirth: expect.any(Date),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      });
    });

    it('should handle case-insensitive email on login', async () => {
      const req = {
        body: {
          email: 'Test@EXAMPLE.COM',
          password: 'password123'
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Get Current User', () => {
    beforeEach(async () => {
      // Create a test user
      await User.create({
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      });
    });

    it('should get current user profile', async () => {
      const user = await User.findOne({ email: 'test@example.com' });

      const req = {
        userId: user?._id.toString()
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await getCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: expect.objectContaining({
            email: 'test@example.com'
          })
        })
      );
    });

    it('should return 404 for non-existent user', async () => {
      const req = {
        userId: new mongoose.Types.ObjectId().toString()
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await getCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'User not found'
        })
      );
    });
  });
});
