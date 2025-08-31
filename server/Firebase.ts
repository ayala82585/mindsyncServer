
import admin from 'firebase-admin';
import * as dotenv from 'dotenv';



dotenv.config();


//const serviceAccount = require('./mindsync-3fb4f-firebase-adminsdk-fbsvc-6a8eb9b421.json');

if (admin.apps.length === 0) {
    const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!path) throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS path');
    const svc = require(path);
  admin.initializeApp({
    credential: admin.credential.cert(svc as admin.ServiceAccount),
  });
}


export async function verifyFirebaseToken(token: string): Promise<{ uid: string, email?: string,full_name?:string }> {
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded;
  } catch (error) {
    throw new Error('Invalid Firebase token');
  }
}

export default admin;
