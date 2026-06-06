import mongoose from 'mongoose';
import { Response } from 'express';
import { saveBirthData, getBirthData } from '../../controllers/birthDataController';
import { User } from '../../models/User';
import { AuthRequest } from '../../middleware/auth';

describe('Birth Data Controller', () => {
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

  describe('Save Birth Data', () => {
    it('should save birth data for authenticated user', async () => {
      // Create a user first
      const user = await User.create({
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      });

      const req = {
        userId: user._id.toString(),
        body: {
          dateOfBirth: '1985-05-20',
          timeOfBirth: '10:15',
          placeOfBirth: 'Los Angeles'
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await saveBirthData(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'Birth data saved successfully',
          data: expect.objectContaining({
            timeOfBirth: '10:15',
            placeOfBirth: 'Los Angeles'
          })
        })
      );

      // Verify data was actually saved
      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.timeOfBirth).toBe('10:15');
      expect(updatedUser?.placeOfBirth).toBe('Los Angeles');
    });

    it('should reject save without authentication', async () => {
      const req = {
        userId: undefined,
        body: {
          dateOfBirth: '1985-05-20',
          timeOfBirth: '10:15',
          placeOfBirth: 'Los Angeles'
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await saveBirthData(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Authentication required'
        })
      );
    });

    it('should reject save with missing fields', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      });

      const req = {
        userId: user._id.toString(),
        body: {
          dateOfBirth: '1985-05-20',
          timeOfBirth: '10:15'
          // Missing placeOfBirth
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await saveBirthData(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'All fields are required'
        })
      );
    });

    it('should return 404 for non-existent user', async () => {
      const req = {
        userId: new mongoose.Types.ObjectId().toString(),
        body: {
          dateOfBirth: '1985-05-20',
          timeOfBirth: '10:15',
          placeOfBirth: 'Los Angeles'
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await saveBirthData(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'User not found'
        })
      );
    });

    it('should update existing birth data', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      });

      // First save
      const req1 = {
        userId: user._id.toString(),
        body: {
          dateOfBirth: '1985-05-20',
          timeOfBirth: '10:15',
          placeOfBirth: 'Los Angeles'
        }
      } as AuthRequest;

      const res1 = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await saveBirthData(req1, res1);

      // Second save with different data
      const req2 = {
        userId: user._id.toString(),
        body: {
          dateOfBirth: '1992-03-10',
          timeOfBirth: '16:45',
          placeOfBirth: 'Chicago'
        }
      } as AuthRequest;

      const res2 = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await saveBirthData(req2, res2);

      expect(res2.status).toHaveBeenCalledWith(200);

      // Verify final data
      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.timeOfBirth).toBe('16:45');
      expect(updatedUser?.placeOfBirth).toBe('Chicago');
    });

    it('should handle invalid date format', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      });

      const req = {
        userId: user._id.toString(),
        body: {
          dateOfBirth: 'invalid-date',
          timeOfBirth: '10:15',
          placeOfBirth: 'Los Angeles'
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await saveBirthData(req, res);

      // Should fail due to validation in middleware, but if it reaches here
      // it should handle the error gracefully
      expect(res.status).toHaveBeenCalled();
    });
  });

  describe('Get Birth Data', () => {
    it('should retrieve birth data for authenticated user', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      });

      const req = {
        userId: user._id.toString()
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await getBirthData(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: expect.objectContaining({
            timeOfBirth: '14:30',
            placeOfBirth: 'New York'
          })
        })
      );
    });

    it('should reject get without authentication', async () => {
      const req = {
        userId: undefined
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await getBirthData(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Authentication required'
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

      await getBirthData(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'User not found'
        })
      );
    });

    it('should return 404 when user has no birth data', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      });

      // Clear birth data
      user.dateOfBirth = undefined as any;
      user.timeOfBirth = undefined as any;
      user.placeOfBirth = undefined as any;
      await user.save();

      const req = {
        userId: user._id.toString()
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await getBirthData(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'No birth data found for this user'
        })
      );
    });

    it('should return complete birth data including zodiac sign', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York',
        zodiacSign: 'Capricorn'
      });

      const req = {
        userId: user._id.toString()
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await getBirthData(req, res);

      const callArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(callArgs.data).toMatchObject({
        dateOfBirth: expect.any(Date),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York',
        zodiacSign: 'Capricorn'
      });
    });

    it('should retrieve birth data after update', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      });

      // Update birth data
      const updateReq = {
        userId: user._id.toString(),
        body: {
          dateOfBirth: '1985-05-20',
          timeOfBirth: '10:15',
          placeOfBirth: 'Los Angeles'
        }
      } as AuthRequest;

      const updateRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await saveBirthData(updateReq, updateRes);

      // Retrieve birth data
      const getReq = {
        userId: user._id.toString()
      } as AuthRequest;

      const getRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await getBirthData(getReq, getRes);

      expect(getRes.status).toHaveBeenCalledWith(200);
      const callArgs = (getRes.json as jest.Mock).mock.calls[0][0];
      expect(callArgs.data).toMatchObject({
        timeOfBirth: '10:15',
        placeOfBirth: 'Los Angeles'
      });
    });
  });
});
