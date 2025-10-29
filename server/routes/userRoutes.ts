import express from 'express';
import { getUserProfileController, updateUserController,handleUserUpsert  } from '../controllers/userController';
import { requireFirebaseAuth } from '../middleware/auth';
import { verifyUserInDb } from '../middleware/verifyUserInDb';
import { requireAdmin } from '../middleware/adminMiddlewere';
import { setRoleAndClaimsController } from '../controllers/userController';

const router = express.Router();

router.post('/upsert', handleUserUpsert);

router.use(requireFirebaseAuth, verifyUserInDb);

router.get('/getMe/:uid', getUserProfileController);
router.patch('/updateMe/:uid', updateUserController);
// router.post('/change-role', requireAdmin, setRoleAndClaimsController); 
 router.post('/change-role', setRoleAndClaimsController); 

export default router;
