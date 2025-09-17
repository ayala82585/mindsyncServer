import { Router, Request, Response} from 'express';
import { verifyEmailStatusController, verifyTokenController } from '../controllers/authController';
import { requireFirebaseAuth, requireFirebaseAuthWithMfa } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminMiddlewere';
import { verifyEmailMiddleware } from '../middleware/verifyEmail';
import { verifyUserInDb } from '../middleware/verifyUserInDb';

const router = Router();

router.use(requireFirebaseAuth,verifyUserInDb);

router.post('/verify-token', verifyTokenController);

router.get("/protected", verifyEmailMiddleware, (req: Request, res: Response) => {
const user = req.user;

if (!user) {
    return res.status(401).json({ error: "User not found on request object" });
  }
  res.json({ message: `Hello ${user.email}, you are verified!` });
});

router.get('/mfa-protected', requireFirebaseAuthWithMfa, (req: Request, res: Response) => {
  res.json({ message: 'You passed MFA successfully!',uid: req.uid
 });
});
router.get('/verify-email-status/:uid', verifyEmailStatusController);


export default router;