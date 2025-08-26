import { Request, Response } from 'express';
import { getUserProfile } from '../service/userService';
import { updateUser } from '../service/userService';
import UserDAL from '../dal/userDal';
import { createOrUpdateUser } from '../service/userService';

export async function handleUserUpsert(req: Request, res: Response) {
    const { uid, email, profile } = req.body;
    
    try {
        const user = await createOrUpdateUser(uid, email, profile);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

const getUserProfileController = async (req: Request, res: Response): Promise<void> => {
  const { uid } = req.params;

  try {
    const userProfile = await getUserProfile(uid);
    if (userProfile) {
      res.status(200).json(userProfile);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in getUserProfileController:',error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateUserController = async (req: Request, res: Response): Promise<void> => {
  const { uid } = req.params;
  const { user } = req.body;
  try {
    const userProfile = await updateUser(uid, user);
    if (userProfile) {
      res.status(200).json(userProfile);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in getUserProfileController:',error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export { getUserProfileController, updateUserController };
