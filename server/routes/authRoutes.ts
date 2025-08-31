
import { Router } from 'express';
import { verifyTokenController,setRoleAndClaimsController} from '../controllers/authController';
import { requireFirebaseAuthWithMfa, requireFirebaseAuth } from '../middleware/auth';

const router = Router();

router.post('/verify-token', verifyTokenController);
router.post('/admin/users/:uid/role', requireFirebaseAuth, requireFirebaseAuthWithMfa, setRoleAndClaimsController);



export default router;


