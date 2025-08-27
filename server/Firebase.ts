
import admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();
console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Firebase Admin SDK initializing...");
const serviceAccount = require('./mindsync-b978b-c1d1826e0375.json'); 
console.log("###################################Firebase Admin SDK initializing...",serviceAccount);

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
export default admin;