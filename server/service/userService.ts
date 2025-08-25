import UserDal from '../dal/userDal';
import { User } from '../models/User';

const userDAL = new UserDal();

const getUserProfile = async (uid: string) => {
  try {
    const user = await userDAL.getUserByUid(uid);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (uid: string, userData: User) => {
  try {
    const user = await userDAL.updateUser(uid, userData);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
};

export { getUserProfile, updateUser };

