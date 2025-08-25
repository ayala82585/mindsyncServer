import { Request, Response } from 'express';
import { getUserProfile } from '../service/userService';
import { updateUser } from '../service/userService';

export const getUserProfileController = async (req: Request, res: Response): Promise<void> => {
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

export const updateUserController = async (req: Request, res: Response): Promise<void> => {
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

