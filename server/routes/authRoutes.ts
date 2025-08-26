
import { Router } from 'express';
import { verifyTokenController } from '../controllers/authController';
import { setRoleAndClaimsController } from '../controllers/authController';
const router = Router();

router.post('/verify-token', verifyTokenController);
router.post('/admin/users/:uid/role', setRoleAndClaimsController); // ← חדש

export default router;


