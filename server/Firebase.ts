
import admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

if (!admin.apps.length) {

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp(); 
  }

  else if (process.env.FIREBASE_SA_JSON) {
    const sa = JSON.parse(process.env.FIREBASE_SA_JSON);
    admin.initializeApp({ credential: admin.credential.cert(sa) });
  }
  
  else {
    throw new Error('Missing Firebase credentials: set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SA_JSON');
  }
}

// פונקציה לאימות טוקן Firebase
export async function verifyFirebaseToken(token: string): Promise<{ uid: string, email?: string, full_name?: string }> {
  try {

    const decoded = await admin.auth().verifyIdToken(token);
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid Firebase token');
  }
}

export const verifyIdToken = (idToken: string) => admin.auth().verifyIdToken(idToken);

export default admin;
