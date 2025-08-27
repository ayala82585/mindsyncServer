
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
// import { Auth } from 'firebase-admin/lib/auth/auth';
import { Auth } from 'firebase-admin/lib/auth';

dotenv.config();
// console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Firebase Admin SDK initializing...");
const serviceAccount = require('./mindsync-b978b-c1d1826e0375.json'); 
// console.log("###################################Firebase Admin SDK initializing...",serviceAccount);

// const serviceAccount = require('./mindsync-b978b-firebase-adminsdk-fbsvc-f0703ab54f.json');

if(admin.apps.length === 0 ){
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});}

export async function verifyFirebaseToken(token: string): Promise<{ uid: string, email?: string, claims: any }> {
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email,
      claims: decoded
    };
  } catch (error) {
    throw new Error('Invalid Firebase token');
  }
}
export const auth: Auth = admin.auth(); // זהו ייצוא עם שם (named export)
export default admin;



// firebase/index.ts

// ייבוא מפורש של הטיפוס 'Auth' משירות האותנטיקציה

// ודא שה-Firebase Admin SDK מאותחל רק פעם אחת בכל הפעלה של השרת/פונקציית ענן.
  // אם אתה מריץ את זה כ-Cloud Function, ה-credentials (האישורים) יאובחנו אוטומטית.
  // אם זהו שרת Node.js רגיל המותקן במקום אחר,
  // ייתכן שתצטרך serviceAccountKey.json:
  /*
  admin.initializeApp({
    credential: admin.credential.cert(require('../../path/to/your/serviceAccountKey.json')),
    // אם אתה משתמש ב-Realtime Database או Cloud Storage, תצטרך גם את ה-URL שלהם:
    // databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
    // storageBucket: "gs://<BUCKET_NAME>.appspot.com"
  });
  */
  // במקרה של Cloud Functions, מספיק קריאה ללא פרמטרים:


// ייצא את שירות ה-Authentication המאותחל.
// חשוב: הגדר במפורש את הטיפוס שלו כ-'Auth' כדי ש-TypeScript יכיר את כל המתודות (כמו sendEmailVerification).

// ניתן לייצא שירותים נוספים מ-Firebase Admin SDK לפי הצורך, לדוגמה:
// export const firestore = admin.firestore();
// export const storage = admin.storage();
// export const messaging = admin.messaging();
