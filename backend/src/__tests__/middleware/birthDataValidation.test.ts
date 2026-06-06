import { Response, NextFunction } from 'express';
import { validateBirthData, BirthDataRequest } from '../../middleware/birthDataValidation';

describe('Birth Data Validation Middleware', () => {
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('Date of Birth Validation', () => {
    it('should reject missing date of birth', () => {
      const req = {
        body: {
          timeOfBirth: '14:30',
          placeOfBirth: 'New York'
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Date of birth is required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject invalid date format', () => {
      const req = {
        body: {
          dateOfBirth: 'invalid-date',
          timeOfBirth: '14:30',
          placeOfBirth: 'New York'
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Date of birth must be in a valid format (YYYY-MM-DD)'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject future date of birth', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];

      const req = {
        body: {
          dateOfBirth: futureDateString,
          timeOfBirth: '14:30',
          placeOfBirth: 'New York'
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Birth date cannot be in the future'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should accept valid past date', () => {
      const req = {
        body: {
          dateOfBirth: '1990-01-15',
          timeOfBirth: '14:30',
          placeOfBirth: 'New York'
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should accept valid date in ISO format', () => {
      const req = {
        body: {
          dateOfBirth: '1990-01-15T00:00:00Z',
          timeOfBirth: '14:30',
          placeOfBirth: 'New York'
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should accept valid date as Date object', () => {
      const req = {
        body: {
          dateOfBirth: new Date('1990-01-15'),
          timeOfBirth: '14:30',
          placeOfBirth: 'New York'
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('Time of Birth Validation', () => {
    it('should reject missing time of birth', () => {
      const req = {
        body: {
          dateOfBirth: '1990-01-15',
          placeOfBirth: 'New York'
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Time of birth is required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject invalid time format - missing colon', () => {
      const req = {
        body: {
          dateOfBirth: '1990-01-15',
          timeOfBirth: '1430',
          placeOfBirth: 'New York'
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Please enter time in HH:MM format (24-hour)'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject invalid hour (25:00)', () => {
      const req = {
        body: {
          dateOfBirth: '1990-01-15',
          timeOfBirth: '25:00',
          placeOfBirth: 'New York'
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Please enter time in HH:MM format (24-hour)'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject invalid minutes (14:60)', () => {
      const req = {
        body: {
          dateOfBirth: '1990-01-15',
          timeOfBirth: '14:60',
          placeOfBirth: 'New York'
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Please enter time in HH:MM format (24-hour)'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should accept valid time formats', () => {
      const validTimes = ['00:00', '12:00', '23:59', '09:30', '14:45', '1:30', '9:05'];

      for (const time of validTimes) {
        const req = {
          body: {
            dateOfBirth: '1990-01-15',
            timeOfBirth: time,
            placeOfBirth: 'New York'
          }
        } as BirthDataRequest;

        validateBirthData(req, mockRes as Response, mockNext as NextFunction);

        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        mockNext.mockClear();
        (mockRes.status as jest.Mock).mockClear();
      }
    });

    it('should reject time with seconds', () => {
      const req = {
        body: {
          dateOfBirth: '1990-01-15',
          timeOfBirth: '14:30:45',
          placeOfBirth: 'New York'
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Please enter time in HH:MM format (24-hour)'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject time with AM/PM', () => {
      const req = {
        body: {
          dateOfBirth: '1990-01-15',
          timeOfBirth: '2:30 PM',
          placeOfBirth: 'New York'
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Please enter time in HH:MM format (24-hour)'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Place of Birth Validation', () => {
    it('should reject missing place of birth', () => {
      const req = {
        body: {
          dateOfBirth: '1990-01-15',
          timeOfBirth: '14:30'
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Place of birth is required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject empty string place of birth', () => {
      const req = {
        body: {
          dateOfBirth: '1990-01-15',
          timeOfBirth: '14:30',
          placeOfBirth: ''
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Place of birth must be a non-empty string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject whitespace-only place of birth', () => {
      const req = {
        body: {
          dateOfBirth: '1990-01-15',
          timeOfBirth: '14:30',
          placeOfBirth: '   '
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Place of birth must be a non-empty string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject place of birth with single character', () => {
      const req = {
        body: {
          dateOfBirth: '1990-01-15',
          timeOfBirth: '14:30',
          placeOfBirth: 'A'
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Place of birth must be at least 2 characters'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should accept valid place of birth', () => {
      const validPlaces = ['New York', 'Los Angeles', 'London', 'Tokyo', 'NY', 'LA'];

      for (const place of validPlaces) {
        const req = {
          body: {
            dateOfBirth: '1990-01-15',
            timeOfBirth: '14:30',
            placeOfBirth: place
          }
        } as BirthDataRequest;

        validateBirthData(req, mockRes as Response, mockNext as NextFunction);

        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        mockNext.mockClear();
        (mockRes.status as jest.Mock).mockClear();
      }
    });

    it('should accept place of birth with leading/trailing whitespace', () => {
      const req = {
        body: {
          dateOfBirth: '1990-01-15',
          timeOfBirth: '14:30',
          placeOfBirth: '  New York  '
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should reject non-string place of birth', () => {
      const req = {
        body: {
          dateOfBirth: '1990-01-15',
          timeOfBirth: '14:30',
          placeOfBirth: 12345
        }
      } as unknown as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Place of birth must be a non-empty string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Complete Valid Birth Data', () => {
    it('should accept complete valid birth data', () => {
      const req = {
        body: {
          dateOfBirth: '1990-01-15',
          timeOfBirth: '14:30',
          placeOfBirth: 'New York'
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should accept complete valid birth data with various formats', () => {
      const testCases = [
        {
          dateOfBirth: '1985-06-20',
          timeOfBirth: '09:15',
          placeOfBirth: 'London'
        },
        {
          dateOfBirth: '2000-12-31',
          timeOfBirth: '23:59',
          placeOfBirth: 'Tokyo'
        },
        {
          dateOfBirth: '1975-03-10',
          timeOfBirth: '00:00',
          placeOfBirth: 'Sydney'
        }
      ];

      for (const testCase of testCases) {
        const req = {
          body: testCase
        } as BirthDataRequest;

        validateBirthData(req, mockRes as Response, mockNext as NextFunction);

        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        mockNext.mockClear();
        (mockRes.status as jest.Mock).mockClear();
      }
    });
  });

  describe('Error Message Clarity', () => {
    it('should provide clear error message for missing date', () => {
      const req = {
        body: {
          timeOfBirth: '14:30',
          placeOfBirth: 'New York'
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      const errorCall = (mockRes.json as jest.Mock).mock.calls[0][0];
      expect(errorCall.message).toContain('Date of birth');
    });

    it('should provide clear error message for invalid time', () => {
      const req = {
        body: {
          dateOfBirth: '1990-01-15',
          timeOfBirth: '25:00',
          placeOfBirth: 'New York'
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      const errorCall = (mockRes.json as jest.Mock).mock.calls[0][0];
      expect(errorCall.message).toContain('HH:MM');
    });

    it('should provide clear error message for missing place', () => {
      const req = {
        body: {
          dateOfBirth: '1990-01-15',
          timeOfBirth: '14:30'
        }
      } as BirthDataRequest;

      validateBirthData(req, mockRes as Response, mockNext as NextFunction);

      const errorCall = (mockRes.json as jest.Mock).mock.calls[0][0];
      expect(errorCall.message).toContain('Place of birth');
    });
  });
});
