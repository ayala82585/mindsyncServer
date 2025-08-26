<<<<<<< HEAD
import express from 'express';
import { getUserProfileController, updateUserController, handleUserUpsert } from '../controllers/userController';
=======
 import { Router, Request, Response, NextFunction } from 'express';
 import  express from 'express';
import { getUserProfileController ,updateUserController} from '../controllers/userController';
import { authenticate } from '../middleware/auth';
>>>>>>> origin/develop

const router = express.Router();

router.get('/getMe/:uid', getUserProfileController);
<<<<<<< HEAD
router.patch('/updateMe/:uid', updateUserController);
router.post('/upsert', handleUserUpsert);

=======
router.patch('/updateMe/:uid', authenticate, updateUserController);
router.get('/protected-route', authenticate, (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Access granted', user: (req as any).user });
});
>>>>>>> origin/develop
export default router;
