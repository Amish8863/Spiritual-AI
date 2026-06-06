import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware, generateToken, AuthRequest } from '../../middleware/auth';
import { config } from '../../config/environment';

describe('Auth Middleware', () => {
  describe('authMiddleware', () => {
    it('should allow request with valid token', () => {
      const userId = 'test-user-id';
      const token = generateToken(userId);

      const req = {
        headers: {
          authorization: `Bearer ${token}`
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      const next = jest.fn();

      authMiddleware(req, res, next as NextFunction);

      expect(req.userId).toBe(userId);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject request without token', () => {
      const req = {
        headers: {}
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      const next = jest.fn();

      authMiddleware(req, res, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'No authentication token provided'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', () => {
      const req = {
        headers: {
          authorization: 'Bearer invalid-token'
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      const next = jest.fn();

      authMiddleware(req, res, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Invalid authentication token'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with expired token', () => {
      // Create an expired token
      const expiredToken = jwt.sign(
        { userId: 'test-user-id' },
        config.jwt.secret,
        { expiresIn: '-1h' } // Expired 1 hour ago
      );

      const req = {
        headers: {
          authorization: `Bearer ${expiredToken}`
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      const next = jest.fn();

      authMiddleware(req, res, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Authentication token has expired'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should extract token from Bearer scheme', () => {
      const userId = 'test-user-id';
      const token = generateToken(userId);

      const req = {
        headers: {
          authorization: `Bearer ${token}`
        }
      } as AuthRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      const next = jest.fn();

      authMiddleware(req, res, next as NextFunction);

      expect(req.userId).toBe(userId);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const userId = 'test-user-id';
      const token = generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
      expect(decoded.userId).toBe(userId);
    });

    it('should generate tokens with expiration', () => {
      const userId = 'test-user-id';
      const token = generateToken(userId);

      const decoded = jwt.decode(token) as any;
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
    });

    it('should generate tokens with same userId', () => {
      const userId = 'test-user-id';
      const token1 = generateToken(userId);
      const token2 = generateToken(userId);

      // Both tokens should be valid
      const decoded1 = jwt.verify(token1, config.jwt.secret) as { userId: string };
      const decoded2 = jwt.verify(token2, config.jwt.secret) as { userId: string };

      expect(decoded1.userId).toBe(userId);
      expect(decoded2.userId).toBe(userId);
    });
  });
});
