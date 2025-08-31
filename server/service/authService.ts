import UserDAL from '../dal/userDal';
import admin from 'firebase-admin';

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
const userDal = new UserDAL();
/**
 * בודק האם המשתמש מאומת ב-DB; אם לא, בודק ב-Firebase, ואם כן – מעדכן DB.
 * מחזיר את המצב לאחר הסנכרון.
 */
export async function checkAndSyncEmailVerified(uid: string): Promise<{
  dbVerified: boolean | null;     // null = המשתמש לא קיים בטבלה
  firebaseVerified: boolean;
  synced: boolean;                // האם בוצע עדכון DB
}> {
  // 1) בדיקת DB
  const dbFlag = await userDal.getVerifyFlag(uid);
  if (dbFlag === true) {
    return { dbVerified: true, firebaseVerified: true, synced: false }; // מניחים עקביות
  }
  // 2) בדיקת Firebase
  const userRecord = await admin.auth().getUser(uid);
  const fbVerified = !!userRecord.emailVerified;
  // 3) אם FB מאומת ו-DB לא – עדכן DB
  if (fbVerified) {
    // אם המשתמש לא קיים בטבלה – dbFlag יהיה null; תחליטי אם לייצר רשומה כאן או לא.
    if (dbFlag === false) {
      await userDal.setVerified(uid);
      return { dbVerified: true, firebaseVerified: true, synced: true };
    }
    console.log('User exists in DB but is not verified',dbFlag);
    // אם dbFlag === null ואין upsert אוטומטי כאן, רק נחזיר סטטוס:
    return { dbVerified: false, firebaseVerified: true, synced: false };
  }
  // 4) לא מאומת ב-Firebase
  return { dbVerified: !!dbFlag, firebaseVerified: false, synced: false };
}

  // מיזוג: קיימים + חדשים (חדשים גוברים)
  // await admin.auth().setCustomUserClaims(uid, { ...existing, ...claims });

