import mongoose from 'mongoose';
import { User } from '../../models/User';

describe('User Model', () => {
  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/premium-astrology-test';
    await mongoose.connect(mongoUri);
  });

  afterEach(async () => {
    // Clear database after each test
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Disconnect after all tests
    await mongoose.disconnect();
  });

  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      };

      const user = await User.create(userData);

      expect(user._id).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.dateOfBirth).toEqual(new Date('1990-01-15'));
      expect(user.timeOfBirth).toBe('14:30');
      expect(user.placeOfBirth).toBe('New York');
    });

    it('should hash password before saving', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      };

      const user = await User.create(userData);
      const savedUser = await User.findById(user._id).select('+password');

      expect(savedUser?.password).not.toBe('password123');
      expect(savedUser?.password).toBeDefined();
    });

    it('should convert email to lowercase', async () => {
      const userData = {
        email: 'Test@EXAMPLE.COM',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      };

      const user = await User.create(userData);

      expect(user.email).toBe('test@example.com');
    });

    it('should trim whitespace from email and place', async () => {
      const userData = {
        email: '  test@example.com  ',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: '  New York  '
      };

      const user = await User.create(userData);

      expect(user.email).toBe('test@example.com');
      expect(user.placeOfBirth).toBe('New York');
    });
  });

  describe('Validation', () => {
    it('should reject missing email', async () => {
      const userData = {
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should reject invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should reject missing password', async () => {
      const userData = {
        email: 'test@example.com',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should reject password shorter than 6 characters', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'pass',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should reject future date of birth', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const userData = {
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: futureDate,
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should reject invalid time format', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '25:00', // Invalid hour
        placeOfBirth: 'New York'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should reject invalid time format with invalid minutes', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:60', // Invalid minutes
        placeOfBirth: 'New York'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should reject missing place of birth', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should reject place of birth shorter than 2 characters', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'A'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should reject duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      };

      await User.create(userData);

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should accept valid zodiac signs', async () => {
      const zodiacSigns = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
      ];

      for (const sign of zodiacSigns) {
        const userData = {
          email: `test-${sign}@example.com`,
          password: 'password123',
          dateOfBirth: new Date('1990-01-15'),
          timeOfBirth: '14:30',
          placeOfBirth: 'New York',
          zodiacSign: sign
        };

        const user = await User.create(userData);
        expect(user.zodiacSign).toBe(sign);
      }
    });

    it('should reject invalid zodiac sign', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York',
        zodiacSign: 'InvalidSign'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('Password Comparison', () => {
    it('should correctly compare matching passwords', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      };

      const user = await User.create(userData);
      const isMatch = await user.comparePassword('password123');

      expect(isMatch).toBe(true);
    });

    it('should reject non-matching passwords', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      };

      const user = await User.create(userData);
      const isMatch = await user.comparePassword('wrongpassword');

      expect(isMatch).toBe(false);
    });
  });

  describe('Timestamps', () => {
    it('should set createdAt and updatedAt timestamps', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New York'
      };

      const user = await User.create(userData);

      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
      expect(user.createdAt).toEqual(user.updatedAt);
    });
  });

  describe('Valid Time Formats', () => {
    it('should accept valid time formats', async () => {
      const validTimes = ['00:00', '12:00', '23:59', '09:30', '14:45'];

      for (const time of validTimes) {
        const userData = {
          email: `test-${time.replace(':', '')}@example.com`,
          password: 'password123',
          dateOfBirth: new Date('1990-01-15'),
          timeOfBirth: time,
          placeOfBirth: 'New York'
        };

        const user = await User.create(userData);
        expect(user.timeOfBirth).toBe(time);
      }
    });
  });
});
