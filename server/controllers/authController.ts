import { Request, Response } from 'express';
import { verifyFirebaseToken } from '../Firebase';
import { createOrUpdateUser } from '../service/userService';
import { checkAndSyncEmailVerified } from '../service/authService';

// אימות טוקן Firebase
export async function verifyTokenController(req: Request, res: Response) {
const header = req.headers.authorization || "";                         
    const idToken = header.startsWith("Bearer ") ? header.slice(7) : "";
      if (!idToken) {
    return res.status(400).json({ error: 'Missing token' });
  }
  try {
    const userData = await verifyFirebaseToken(idToken);
    res.json(userData);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// סינכרון משתמש מבוסס טוקן Firebase
export async function syncUserFromTokenController(req: Request, res: Response) {
  const { token } = req.body as { token?: string };
  if (!token) return res.status(400).json({ error: 'Missing token' });
  try {
    const decoded = await verifyFirebaseToken(token);
    const uid = decoded.uid;
    const email = decoded.email || '';
    const full_name = decoded.full_name || '';
    const user = await createOrUpdateUser(uid, email, full_name);
    if (!user) return res.status(500).json({ error: 'Failed to upsert user' });
    return res.status(200).json(user);
  } catch (err: any) {
    return res.status(401).json({ error: err?.message || 'Invalid token' });
  }
}

// בדיקת סטטוס אימות אימייל
export async function verifyEmailStatusController(req: Request, res: Response) {
  const { uid } = req.params; 
  if (!uid) 
    return res.status(400).json({ error: 'Missing uid' });
  try {
    const result = await checkAndSyncEmailVerified(uid);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'verify email failed' });
  }
}


