 import { Router, Request, Response, NextFunction } from 'express';
 import  express from 'express';
import { getUserProfileController ,handleUserUpsert,updateUserController} from '../controllers/userController';
import { requireFirebaseAuth, requireFirebaseAuthWithMfa } from '../middleware/auth';
import { verifyEmailMiddleware } from '../middleware/verifyEmail';

const router = express.Router();

router.get('/getMe/:uid', getUserProfileController);
router.patch('/updateMe/:uid', requireFirebaseAuth, updateUserController);
router.get('/protected-route', requireFirebaseAuth, (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Access granted', user: (req as any).user });
});
router.get("/protected", verifyEmailMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ message: `Hello ${user.email}, you are verified!` });
});
// 🔐 נתיב חדש: דוגמה לנתיב שדורש MFA (TOTP)
router.get('/mfa-protected', requireFirebaseAuthWithMfa, (req: Request, res: Response) => {
  res.json({ message: 'You passed MFA successfully!', uid: (req as any).uid });
});
export default router;
