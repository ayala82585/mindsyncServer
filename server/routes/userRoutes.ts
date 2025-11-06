import express from 'express';
import { getUserProfileController,handleUserUpsert  } from '../controllers/userController';
import { requireFirebaseAuth } from '../middleware/auth';
import { verifyUserInDb } from '../middleware/verifyUserInDb';
import { requireAdmin } from '../middleware/adminMiddlewere';
import { setRoleAndClaimsController } from '../controllers/userController';
import { verifyEmailMiddleware } from '../middleware/verifyEmail';

const router = express.Router();

router.post('/upsert',verifyEmailMiddleware, handleUserUpsert);

router.use(requireFirebaseAuth, verifyUserInDb);

router.get('/getMe/:uid', getUserProfileController);
// router.patch('/updateMe/:uid', updateUserController);
// router.post('/change-role', requireAdmin, setRoleAndClaimsController); 
 router.post('/change-role',requireAdmin, setRoleAndClaimsController); 

export default router;
