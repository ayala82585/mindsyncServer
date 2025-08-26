import UserDal, { UserDAL } from '../dal/userDal';
import { User } from '../models/User';
//import { upsertUserFromFirebase } from '../dal/userDal';
import upsertUserFromFirebase from '../dal/userDal';
import admin from 'firebase-admin';


const userDAL = new UserDal();

async function createOrUpdateUser(uid: string, email: string, profile: { displayName?: string; photoURL?: string }): Promise<User | null> {
    const userDal = new UserDAL(); // יצירת מופע של UserDAL
     const userData: User = {
    uid, 
    email,
    full_name: profile.displayName !== undefined ? profile.displayName : 'ברירת מחדל',
    photo_url: profile.photoURL !== undefined ? profile.photoURL : 'ברירת מחדל',
    created_at: new Date(), 
    updated_at: new Date() 
};

        return await userDal.upsertUserFromFirebase(uid, userData);

   // return await userDal.upsertUserFromFirebase(uid, { email, full_name: profile.displayName, photo_url: profile.photoURL });
}

// async function createOrUpdateUser(uid: string, email: string, profile: { displayName?: string; photoURL?: string }): Promise<User> {
  //   await upsertUserFromFirebase(uid, email, profile);


    


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

export async function setUserRole(uid: string, role: string): Promise<void> {
  // אפשר לשלב לוגיקה עסקית: בדיקות role חוקי וכו'
  const claims = { role, admin: role === 'admin' };
  await admin.auth().setCustomUserClaims(uid, claims);
}

export async function setCustomClaims(uid: string, claims: Record<string, any>): Promise<void> {
  // הבאת claims קיימים (לא חובה, אבל שימושי למיזוג)
  const user = await admin.auth().getUser(uid);
  const existing = (user.customClaims || {}) as Record<string, any>;

  // מיזוג: קיימים + חדשים (חדשים גוברים)
  await admin.auth().setCustomUserClaims(uid, { ...existing, ...claims });
}
export { getUserProfile, updateUser , createOrUpdateUser };

