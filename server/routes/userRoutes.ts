import express from 'express';
import { deleteUserController, getUserProfileController,handleUserUpsert  } from '../controllers/userController';
import { requireFirebaseAuth } from '../middleware/auth';
import { verifyUserInDb } from '../middleware/verifyUserInDb';
import { requireAdmin } from '../middleware/adminMiddlewere';
import { setRoleAndClaimsController } from '../controllers/userController';
import { verifyEmailMiddleware } from '../middleware/verifyEmail';

const router = express.Router();

router.post('/upsert', handleUserUpsert);

router.use(requireFirebaseAuth, verifyUserInDb);

router.get('/getUser/:uid', getUserProfileController);
// router.patch('/updateMe/:uid', updateUserController);
// router.post('/change-role', requireAdmin, setRoleAndClaimsController); 
 router.put('/change-role',requireAdmin, setRoleAndClaimsController); 
router.delete("/delete/:id", requireAdmin, deleteUserController);

export default router;
