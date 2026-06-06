import { Router } from 'express';
import { generateKundali, getKundali, deleteKundali } from '../controllers/kundaliController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All Kundali routes require authentication
router.use(authMiddleware);

/**
 * POST /api/kundali/generate
 * Generate Kundali for authenticated user
 */
router.post('/generate', generateKundali);

/**
 * GET /api/kundali/get
 * Get user's Kundali
 */
router.get('/get', getKundali);

/**
 * DELETE /api/kundali/delete
 * Delete user's Kundali
 */
router.delete('/delete', deleteKundali);

export default router;
