
import { Router } from 'express';
import { verifyEmailStatusController, verifyTokenController } from '../controllers/authController';
import { setRoleAndClaimsController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
const router = Router();

router.post('/verify-token', verifyTokenController);
router.post('/admin/users/:uid/role', setRoleAndClaimsController); // ← חדש
router.get('/auth/verify-email-status/:uid', authenticate, verifyEmailStatusController);
export default router;