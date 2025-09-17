import UserDAL from '../dal/userDal';
import admin from '../Firebase';

 const userDal = new UserDAL();

export async function setUserRole(uid: string, newRole: string) {
    
  await admin.auth().setCustomUserClaims(uid, { role: newRole });

  await userDal.updateUserRole(uid, newRole);

}

export async function checkAndSyncEmailVerified(uid: string): Promise<{
  dbVerified: boolean | null;
  firebaseVerified: boolean;
  synced: boolean;
}> {
  // 1) בדיקת DB
  const dbFlag = await userDal.getVerifyFlag(uid);
  if (dbFlag === true) {
    return { dbVerified: true, firebaseVerified: true, synced: false };
  }
  // 2) בדיקת Firebase
  const userRecord = await admin.auth().getUser(uid);
  const fbVerified = !!userRecord.emailVerified;
  // 3) אם FB מאומת ו-DB לא – עדכן DB
  if (fbVerified) {
    if (dbFlag === false) {
      await userDal.setVerified(uid);
      return { dbVerified: true, firebaseVerified: true, synced: true };
    }
    console.log('User exists in DB but is not verified', dbFlag);
    return { dbVerified: false, firebaseVerified: true, synced: false };
  }
  // 4) לא מאומת ב-Firebase
  return { dbVerified: !!dbFlag, firebaseVerified: false, synced: false };
}
