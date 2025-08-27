import admin from '../Firebase';
import { sendAuthEmailVerification, updateAuthUser } from '../dal/authDal'; // ודא שהנתיב נכון
import { getUserProfile, updateUser } from './userService';


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

export async function sendVerificationEmail(uid: string) {
  try {
    const userRecord = await getUserProfile(uid);

    // אופציונלי: ודא שהאימייל מסומן כלא מאומת לפני שליחת קישור אימות חדש.
    // זה עוזר אם הסטטוס היה בטעות true או אם המשתמש רוצה לאמת מחדש.
    // await updateUser(uid, { emailVerified: false });
await updateAuthUser(uid, { emailVerified: false } as admin.auth.UpdateRequest);    // הגדרות הקישור לאימות האימייל
    // חשוב: עדכן את ה-URL לכתובת המדויקת של דף ההצלחה באפליקציית ה-Web שלך.
    const actionCodeSettings: admin.auth.ActionCodeSettings = {
      url: 'https://mindsync-b978b.firebaseapp.com/success', // ה-URL של דף הטיפול באימות באפליקציית ה-Web שלך
      handleCodeInApp: true, // אומר ל-Firebase שהטיפול בקישור יתבצע בתוך האפליקציה שלך (בדפדפן)
      // locale: 'he', // אופציונלי: הגדרת שפת האימייל שיישלח
    };

    await sendAuthEmailVerification(uid, actionCodeSettings);

    console.log(`אימייל אימות נשלח לכתובת: ${userRecord.email}`);
    return { success: true, message: 'Verification email sent successfully.' };

  } catch (error: any) {
    console.error("שגיאה בשליחת אימייל אימות:", error);
    // זרוק שגיאה עם הודעה ברורה שתעבור לשכבת ה-controller
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}
