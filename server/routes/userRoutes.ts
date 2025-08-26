 import { Router, Request, Response, NextFunction } from 'express';
 import  express from 'express';
import { getUserProfileController ,handleUserUpsert,updateUserController} from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/getMe/:uid', getUserProfileController);
router.post('/upsert', handleUserUpsert);
router.patch('/updateMe/:uid', authenticate, updateUserController);
router.get('/protected-route', authenticate, (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Access granted', user: (req as any).user });
});
export default router;
