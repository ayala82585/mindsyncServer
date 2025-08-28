
import admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccount = require('./mindsync-3fb4f-firebase-adminsdk-fbsvc-6a8eb9b421.json');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export async function verifyFirebaseToken(token: string): Promise<{ uid: string, email?: string,full_name:string }> {
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email,
      full_name: decoded.full_name
    };
  } catch (error) {
    throw new Error('Invalid Firebase token');
  }
}

export default admin;
