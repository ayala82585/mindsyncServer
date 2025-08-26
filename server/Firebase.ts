
import admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();


const serviceAccount = require('./mindsync-3fb4f-firebase-adminsdk-fbsvc-6a8eb9b421.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

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