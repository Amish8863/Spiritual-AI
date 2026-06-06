import { Router } from 'express';
import {
  saveBirthData,
  getBirthData
} from '../controllers/birthDataController';
import { authMiddleware } from '../middleware/auth';
import { validateBirthData } from '../middleware/birthDataValidation';

const router = Router();

/**
 * POST /api/users/birth-data
 * Save or update user's birth data
 * Requires authentication
 * Validates birth data (date, time, place) before processing
 * 
 * Requirements: 1.3, 17.2
 */
router.post('/', authMiddleware, validateBirthData, saveBirthData);

/**
 * GET /api/users/birth-data
 * Retrieve user's birth data
 * Requires authentication
 * 
 * Requirements: 1.5, 17.4
 */
router.get('/', authMiddleware, getBirthData);

export default router;
