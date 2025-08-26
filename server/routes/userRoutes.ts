import express from 'express';
 import { Router, Request, Response, NextFunction } from 'express';
import { handleUserUpsert, getUserProfileController, updateUserController } from '../controllers/userController';
import { syncUserFromTokenController } from '../controllers/authController';
import { requireAuth ,authenticate} from '../middleware/auth';

const router = express.Router();

router.get('/getMe/:uid', getUserProfileController);
router.patch('/updateMe/:uid', updateUserController);
 router.post('/upsert', handleUserUpsert);

 router.post('/users/sync-from-token', requireAuth, syncUserFromTokenController);
// router.get('/users/:uid', requireAuth, getUserProfileController);
// router.patch('/users/:uid', requireAuth, updateUserController);
// אם צריך גם upsert בלי טוקן:
router.post('/users/upsert', handleUserUpsert);
router.get('/protected-route', authenticate, (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Access granted', user: (req as any).user });
});
export default router;
