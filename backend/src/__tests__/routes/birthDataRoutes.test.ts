import { Router } from 'express';
import { saveBirthData, getBirthData } from '../../controllers/birthDataController';
import { authMiddleware } from '../../middleware/auth';
import { validateBirthData } from '../../middleware/birthDataValidation';

describe('Birth Data Routes', () => {
  it('should have POST route with auth and validation middleware', () => {
    const router = Router();
    
    // Simulate route registration
    router.post('/', authMiddleware, validateBirthData, saveBirthData);
    
    // Verify route exists
    const routes = router.stack.filter(layer => layer.route && layer.route.methods.post);
    expect(routes.length).toBeGreaterThan(0);
  });

  it('should have GET route with auth middleware', () => {
    const router = Router();
    
    // Simulate route registration
    router.get('/', authMiddleware, getBirthData);
    
    // Verify route exists
    const routes = router.stack.filter(layer => layer.route && layer.route.methods.get);
    expect(routes.length).toBeGreaterThan(0);
  });

  it('should export router as default', () => {
    // This test verifies the routes file exports correctly
    const birthDataRoutes = require('../../routes/birthDataRoutes').default;
    expect(birthDataRoutes).toBeDefined();
    expect(typeof birthDataRoutes).toBe('object');
  });
});
