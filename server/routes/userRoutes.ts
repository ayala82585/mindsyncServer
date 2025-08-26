import express from 'express';
import { getUserProfileController, updateUserController, handleUserUpsert } from '../controllers/userController';

const router = express.Router();

router.get('/getMe/:uid', getUserProfileController);
router.patch('/updateMe/:uid', updateUserController);
router.post('/upsert', handleUserUpsert);

export default router;
