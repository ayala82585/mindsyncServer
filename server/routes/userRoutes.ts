import express from 'express';
import { getUserProfileController } from '../controllers/userController';
import { updateUserController } from '../controllers/userController';

const router = express.Router();

router.get('/getMe/:uid', getUserProfileController);
router.patch('/updateMe/:uid', updateUserController);

export default router;
