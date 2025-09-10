
import { Router, Request, Response } from 'express';
import { verifyEmailStatusController, verifyTokenController } from '../controllers/authController';
import { requireFirebaseAuth, requireFirebaseAuthWithMfa } from '../middleware/auth';
import { verifyEmailMiddleware } from '../middleware/verifyEmail';
import { verifyUserInDb } from '../middleware/verifyUserInDb';

const router = Router();

router.use(requireFirebaseAuth, verifyUserInDb);

router.post('/verify-token', verifyTokenController);

router.get("/protected", verifyEmailMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ message: `Hello ${user.email}, you are verified!` });
});

router.get('/verify-email-status/:uid', verifyEmailStatusController);

router.get('/mfa-protected', requireFirebaseAuthWithMfa, (req: Request, res: Response) => {
  res.json({ message: 'You passed MFA successfully!', uid: (req as any).uid });
});

export default router;