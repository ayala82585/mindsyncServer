import UserDal from '../dal/userDal';
import admin from '../Firebase';
import { User } from '../models/User';

const userDAL = new UserDal();

// פונקציה ליצירה או עדכון משתמש מבוסס Firebase                                 
async function createOrUpdateUser(uid: string, email: string, full_name: string): Promise<User | null> {
     const userData: User = {
    uid, 
    email,
    full_name,
    photo_url: 'ברירת מחדל',
    created_at: new Date(),
    updated_at: new Date()
};
        return await userDAL.upsertUserFromFirebase(uid, userData);

}

//  לקבלת פרופיל משתמש לפי UID
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

// פונקציה לעדכון פרטי משתמש
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

// הגדרת תפקיד למשתמש ועדכון ה-claims ב-Firebase
async function setUserRole(targetUid: string, newRole: string) {
  
  await admin.auth().setCustomUserClaims(targetUid, { role: newRole });
  await userDAL.updateUserRole(targetUid, newRole);
}

export { getUserProfile, updateUser, createOrUpdateUser, setUserRole };
