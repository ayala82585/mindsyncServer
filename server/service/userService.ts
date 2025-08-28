
import UserDal, { UserDAL } from '../dal/userDal';
import { User } from '../models/User';
import upsertUserFromFirebase from '../dal/userDal';
import admin from 'firebase-admin';

const userDAL = new UserDal();

async function createOrUpdateUser(uid: string, email: string, full_name: string): Promise<User | null> {
    const userDal = new UserDAL(); // יצירת מופע של UserDAL
     const userData: User = {
    uid, 
    email,
    full_name,
    photo_url: 'ברירת מחדל',
    role: 'user', // או כל תפקיד ברירת מחדל שתרצה
    created_at: new Date(),
    updated_at: new Date()
};
        return await userDal.upsertUserFromFirebase(uid, userData);

}

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




export { getUserProfile, updateUser , createOrUpdateUser };
