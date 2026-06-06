import { Router } from 'express';
import {
  getDailyHoroscope,
  getHoroscopeBySign,
  createHoroscope,
} from '../controllers/horoscopeController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * GET /api/horoscope/daily
 * Get daily horoscope for all zodiac signs (public)
 */
router.get('/daily', getDailyHoroscope);

/**
 * GET /api/horoscope/by-sign/:sign
 * Get horoscope for specific zodiac sign (public)
 */
router.get('/by-sign/:sign', getHoroscopeBySign);

/**
 * POST /api/horoscope/create
 * Create or update horoscope (admin only - requires auth)
 */
router.post('/create', authMiddleware, createHoroscope);

export default router;
