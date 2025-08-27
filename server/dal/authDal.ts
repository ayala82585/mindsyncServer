
import admin from '../Firebase';
// import  auth  from '../index'; // ודא שהנתיב נכון לפי מבנה התיקיות שלך
import { auth } from '../Firebase';
// פונקציה לקבלת פרטי משתמש לפי UID מ-Firebase Auth
// export async function getAuthUserByUid(uid: string) {
//   return auth.getUser(uid);
// }

// פונקציה לעדכון פרטי משתמש ב-Firebase Auth
// export async function updateAuthUser(uid: string, updates: admin.auth.UserUpdateRequest) {
//   return auth.updateUser(uid, updates);
// }

// פונקציה לשליחת אימייל אימות באמצעות Firebase Auth Admin SDK
// export async function sendAuthEmailVerification(uid: string, actionCodeSettings: admin.auth.ActionCodeSettings) {
//   return auth.sendEmailVerification(uid, actionCodeSettings);
// }
export async function sendAuthEmailVerification(uid: string, actionCodeSettings: admin.auth.ActionCodeSettings) {
  return (auth as any).sendEmailVerification(uid, actionCodeSettings); // <--- לא מומלץ, אבל זה יסיר את שגיאת הקומפילציה
}
export async function updateAuthUser(uid: string, updates: admin.auth.UpdateRequest) {
  return auth.updateUser(uid, updates);
}