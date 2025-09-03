
import { Router } from 'express';
import { verifyEmailStatusController, verifyTokenController } from '../controllers/authController';
import { setRoleAndClaimsController } from '../controllers/authController';
import { requireFirebaseAuth } from '../middleware/auth';
const router = Router();

router.post('/verify-token', verifyTokenController);
router.post('/admin/users/:uid/role', setRoleAndClaimsController); // ← חדש
router.get('/verify-email-status/:uid', requireFirebaseAuth, verifyEmailStatusController);


export default router;