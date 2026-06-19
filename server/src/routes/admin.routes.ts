import { Router } from 'express';
import { getStats, getSales, updateConfig, getConfig, searchUsers } from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/stats', getStats);
router.get('/sales', getSales);
router.get('/config', getConfig);
router.put('/config', updateConfig);
router.get('/users/search', searchUsers);

export default router;
