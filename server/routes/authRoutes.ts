
import { Router } from 'express';
import { verifyTokenController,setRoleAndClaimsController} from '../controllers/authController';
import { requireFirebaseAuthWithMfa, requireFirebaseAuth ,requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/verify-token', verifyTokenController);
router.post(
  '/admin/users/:uid/role',
  requireFirebaseAuth,
  requireFirebaseAuthWithMfa,
  requireAdmin,
  setRoleAndClaimsController
);


export default router;


